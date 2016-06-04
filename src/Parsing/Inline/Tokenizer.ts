import { escapeForRegex, startsWith, optional, atLeast, ANY_WHITESPACE, WHITESPACE_CHAR, NON_WHITESPACE_CHAR } from '../../Patterns'
import { REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE, LINK, PARENTHESIZED, SQUARE_BRACKETED, ACTION } from './RichConventions'
import { AUDIO, IMAGE, VIDEO } from './MediaConventions'
import { UpConfig } from '../../UpConfig'
import { RichConvention } from './RichConvention'
import { MediaConvention } from './MediaConvention'
import { applyRaisedVoices }  from './RaisedVoices/applyRaisedVoices'
import { nestOverlappingConventions } from './nestOverlappingConventions'
import { OnTokenizerMatch } from './OnTokenizerMatch'
import { last, remove } from '../../CollectionHelpers'
import { TokenizerGoal } from './TokenizerGoal'
import { TokenizableSandwich } from './TokenizableSandwich'
import { Bracket } from './Bracket'
import { TokenizableRawTextBracket } from './TokenizableRawTextBracket'
import { TokenizableRichBracket } from './TokenizableRichBracket'
import { TokenizableMedia } from './TokenizableMedia'
import { FailedGoalTracker } from './FailedGoalTracker'
import { TokenizerContext } from './TokenizerContext'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { InlineConsumer } from './InlineConsumer'
import { TokenKind } from './TokenKind'
import { Token } from './Token'
import { NewTokenArgs } from './NewTokenArgs'


export class Tokenizer {
  tokens: Token[] = []

  private consumer: InlineConsumer

  // Any time we open a new convention, we add it to `openContexts`.
  private openContexts: TokenizerContext[] = []

  private failedGoalTracker: FailedGoalTracker = new FailedGoalTracker()

  // The this buffer is for any text that isn't consumed by special delimiters. Eventually, the buffer gets
  // flushed to a token, asually a PlainTextToken.
  private buffer = ''

  private footnoteConvention = getRichSandwich({
    richConvention: FOOTNOTE,
    startPattern: ANY_WHITESPACE + escapeForRegex('(('),
    endPattern: escapeForRegex('))')
  })

  private revisionDeletionConvention = getRichSandwich({
    richConvention: REVISION_DELETION,
    startPattern: '~~',
    endPattern: '~~'
  })

  private revisionInsertionConvention = getRichSandwich({
    richConvention: REVISION_INSERTION,
    startPattern: escapeForRegex('++'),
    endPattern: escapeForRegex('++')
  })

  private actionConvention = getRichSandwich({
    richConvention: ACTION,
    startPattern: CURLY_BRACKET.startPattern,
    endPattern: CURLY_BRACKET.endPattern
  })

  private richBrackets = [
    new TokenizableRichBracket(PARENTHESIZED, PARENTHESIS),
    new TokenizableRichBracket(SQUARE_BRACKETED, SQUARE_BRACKET)
  ]

  // Unlike the other bracket conventions, these don't produce special tokens.
  //
  // They can only appear inside URLs or media conventions' descriptions, and they allow matching
  // brackets to be included without having to escape any closing brackets.

  private parenthesizedRawTextConvention = new TokenizableRawTextBracket(
    TokenizerGoal.ParenthesizedInRawText, PARENTHESIS)

  private squareBracketedRawTextConvention = new TokenizableRawTextBracket(
    TokenizerGoal.SquareBracketedInRawText, SQUARE_BRACKET)

  private curlyBracketedRawTextConvention = new TokenizableRawTextBracket(
    TokenizerGoal.CurlyBracketedInRawText, CURLY_BRACKET)

  private rawTextBrackets = [
    this.parenthesizedRawTextConvention,
    this.squareBracketedRawTextConvention,
    this.curlyBracketedRawTextConvention
  ]

  // The start pattern for the spoiler convention relies on a user-configurable value, so we assign
  // this field in the `configureConventions` method where we have access to the user's config settings.
  private spoilerConvention: TokenizableSandwich

  // These conventions are for images, audio, and video
  private mediaConventions: TokenizableMedia[]

  // A rich sandwich:
  //
  // 1. Can contain other inline conventions
  // 2. Involves just two delimiters: one to mark its start, and one to mark its end
  //
  // We can't create the collection until the spoiler convention has been configured.
  private richSandwiches: TokenizableSandwich[]

  constructor(entireText: string, config: UpConfig) {
    this.consumer = new InlineConsumer(entireText)

    this.configureConventions(config)
    this.tokenize()
  }

  private configureConventions(config: UpConfig): void {
    this.mediaConventions =
      [AUDIO, IMAGE, VIDEO].map(media =>
        new TokenizableMedia(media, config.localizeTerm(media.nonLocalizedTerm)))

    this.spoilerConvention =
      getRichSandwich({
        richConvention: SPOILER,
        startPattern: SQUARE_BRACKET.startPattern + escapeForRegex(config.settings.i18n.terms.spoiler) + ':' + ANY_WHITESPACE,
        endPattern: SQUARE_BRACKET.endPattern
      })

    this.richSandwiches = [
      this.spoilerConvention,
      this.footnoteConvention,
      this.revisionDeletionConvention,
      this.revisionInsertionConvention,
      this.actionConvention,
    ]
  }

  private tokenize(): void {
    while (!this.isDone()) {

      this.tryToCollectEscapedChar()
        || this.tryToCloseAnyOpenContext()
        || (this.hasGoal(TokenizerGoal.NakedUrl) && this.appendCharToNakedUrl())
        || this.tryToTokenizeRaisedVoicePlaceholders()
        || this.tryToOpenAnyConvention()
        || this.bufferCurrentChar()
    }

    this.tokens =
      nestOverlappingConventions(
        applyRaisedVoices(this.tokens))
  }

  private tryToOpenAnyConvention(): boolean {
    return (
      this.tryToOpenMedia()
      || this.tryToOpenInlineCode()
      || this.tryToOpenAnyRichSandwich()
      || this.tryToOpenAnyRichBracket()
      || this.tryToOpenNakedUrl())
  }

  private isDone(): boolean {
    return this.consumer.reachedEndOfText() && this.resolveOpenContexts()
  }

  private tryToCloseAnyOpenContext(): boolean {
    for (let i = this.openContexts.length - 1; i >= 0; i--) {
      if (this.tryToCloseContext(this.openContexts[i])) {
        return true
      }
    }

    return false
  }

  private tryToCloseContext(context: TokenizerContext): boolean {
    const { goal } = context

    return (
      this.tryToCloseRichSandwichCorrespondingToContext(context)
      || this.handleMediaCorrespondingToGoal(goal)
      || this.tryToCloseRichBracketCorrespondingToContext(context)
      || this.tryToCloseRawTextBracketCorrespondingToContext(context)
      || ((goal === TokenizerGoal.InlineCode) && this.closeInlineCodeOrAppendCurrentChar(context))
      || ((goal === TokenizerGoal.MediaUrl) && this.closeMediaOrAppendCharToUrl(context))
      || ((goal === TokenizerGoal.NakedUrl) && this.tryToCloseNakedUrl(context))
    )
  }

  private closeInlineCodeOrAppendCurrentChar(context: TokenizerContext): boolean {
    return this.tryToCloseInlineCode(context) || this.bufferCurrentChar()
  }

  private tryToOpenInlineCode(): boolean {
    return this.tryToOpenConvention({
      goal: TokenizerGoal.InlineCode,
      pattern: INLINE_CODE_DELIMITER_PATTERN,
      flushBufferToPlainTextTokenBeforeOpeningConvention: true
    })
  }

  private tryToCloseInlineCode(context: TokenizerContext): boolean {
    return this.tryToCloseConvention({
      pattern: INLINE_CODE_DELIMITER_PATTERN,
      context,
      then: () => {
        this.createTokenAndAppend({ kind: TokenKind.InlineCode, value: this.flushBuffer() })
      }
    })
  }

  private appendCharToNakedUrl(): boolean {
    return (
      this.tryToOpenParenthesizedRawText()
      || this.tryToOpenSquareBracketedRawText()
      || this.tryToOpenCurlyBracketedRawText()
      || this.bufferCurrentChar())
  }

  private closeMediaOrAppendCharToUrl(context: TokenizerContext): boolean {
    return (
      this.tryToOpenSquareBracketedRawText()
      || this.tryToCloseMedia(context)
      || this.bufferCurrentChar())
  }

  private tryToCloseRichSandwichCorrespondingToContext(context: TokenizerContext): boolean {
    return this.richSandwiches.some(richSandwich =>
      (richSandwich.goal === context.goal)
      && this.tryToCloseRichSandwich(richSandwich, context))
  }

  private tryToCloseRawTextBracketCorrespondingToContext(context: TokenizerContext): boolean {
    return this.rawTextBrackets.some(rawTextBracket =>
      (rawTextBracket.goal === context.goal)
      && this.tryToCloseRawTextBracket(rawTextBracket, context))
  }

  private tryToCloseRichBracketCorrespondingToContext(context: TokenizerContext): boolean {
    return this.richBrackets.some(richBracket =>
      (richBracket.convention.tokenizerGoal === context.goal)
      && this.tryToCloseRichBracket(richBracket, context))
  }

  private handleMediaCorrespondingToGoal(goal: TokenizerGoal): boolean {
    return this.mediaConventions.some(media => (media.goal === goal) && this.handleMedia(media))
  }

  private handleMedia(media: TokenizableMedia): boolean {
    return (
      this.tryToOpenMediaUrl()
      || this.tryToOpenSquareBracketedRawText()
      || this.tryToCloseFalseMediaConvention(media.goal)
      || this.bufferCurrentChar())
  }

  private tryToCloseFalseMediaConvention(mediaGoal: TokenizerGoal): boolean {
    if (!CLOSE_SQUARE_BRACKET_PATTERN.test(this.consumer.remainingText)) {
      return false
    }

    // If we encounter a closing square bracket here, it means it's unmatched. If it were matched, it would have
    // been consumed by a SquareBracketedInRawText context.
    //
    // Anyway, we're dealing with something like this: [audio: garbled]
    //
    // That is not a valid media convention, so we need to backtrack!

    this.failMostRecentContextWithGoalAndResetToBeforeIt(mediaGoal)
    return true
  }

  private tryToOpenAnyRichSandwich(): boolean {
    return this.richSandwiches.some(sandwich => this.tryToOpenRichSandwich(sandwich))
  }

  private tryToOpenAnyRichBracket(): boolean {
    return this.richBrackets.some(bracket => this.tryToOpenRichBracket(bracket))
  }

  private tryToOpenParenthesizedRawText(): boolean {
    return this.tryToOpenRawTextBracket(this.parenthesizedRawTextConvention)
  }

  private tryToOpenSquareBracketedRawText(): boolean {
    return this.tryToOpenRawTextBracket(this.squareBracketedRawTextConvention)
  }

  private tryToOpenCurlyBracketedRawText(): boolean {
    return this.tryToOpenRawTextBracket(this.curlyBracketedRawTextConvention)
  }

  private tryToCollectEscapedChar(): boolean {
    const ESCAPE_CHAR = '\\'

    if (this.consumer.currentChar !== ESCAPE_CHAR) {
      return false
    }

    this.consumer.advanceTextIndex(1)

    return (
      this.consumer.reachedEndOfText()
      || this.bufferCurrentChar()
    )
  }

  private tryToOpenNakedUrl(): boolean {
    return this.tryToOpenConvention({
      goal: TokenizerGoal.NakedUrl,
      pattern: NAKED_URL_PROTOCOL_PATTERN,
      flushBufferToPlainTextTokenBeforeOpeningConvention: true,
      thenAddAnyStartTokens: urlProtocol => {
        this.createTokenAndAppend({ kind: TokenKind.NakedUrlProtocolAndStart, value: urlProtocol })
      }
    })
  }

  private tryToCloseNakedUrl(context: TokenizerContext): boolean {
    // Whitespace terminates naked URLs, but we don't advance past the whitespace character or do anything with it
    // yet.
    //
    // Instead, we leave the whitespace to be matched by another convention (e.g. a footnote, which consumes any
    // leading whitespace).
    if (WHITESPACE_CHAR_PATTERN.test(this.consumer.currentChar)) {
      this.closeContext({
        contextToClose: context,
        closeInnerContexts: true,
        thenAddAnyClosingTokens: () => {
          this.flushBufferToNakedUrlEndToken()
        }
      })
      return true
    }

    return false
  }

  private tryToOpenMedia(): boolean {
    return this.mediaConventions.some(media => {
      return this.tryToOpenConvention({
        goal: media.goal,
        pattern: media.startPattern,
        flushBufferToPlainTextTokenBeforeOpeningConvention: true,
        thenAddAnyStartTokens: () => {
          this.createTokenAndAppend({ kind: media.startTokenKind })
        }
      })
    })
  }

  private tryToOpenMediaUrl(): boolean {
    return this.tryToOpenConvention({
      goal: TokenizerGoal.MediaUrl,
      pattern: URL_ARROW_PATTERN_DEPCRECATED,
      flushBufferToPlainTextTokenBeforeOpeningConvention: false,
      thenAddAnyStartTokens: () => {
        this.createTokenAndAppend({ kind: TokenKind.MediaDescription, value: this.flushBuffer() })
      }
    })
  }

  private tryToCloseMedia(context: TokenizerContext): boolean {
    return this.consumer.advanceAfterMatch({
      pattern: MEDIA_END_PATTERN_DEPCRECATED,
      then: () => {
        this.closeContext({
          contextToClose: context,
          thenAddAnyClosingTokens: () => {
            this.createTokenAndAppend({ kind: TokenKind.MediaUrlAndEnd, value: this.flushBuffer() })
          }
        })

        // Once the media URL's context is closed, the media's context is guaranteed to be innermost.
        this.openContexts.pop()
      }
    })
  }

  private tryToOpenRichSandwich(sandwich: TokenizableSandwich): boolean {
    return this.tryToOpenConvention({
      goal: sandwich.goal,
      pattern: sandwich.startPattern,
      flushBufferToPlainTextTokenBeforeOpeningConvention: true
    })
  }

  private tryToOpenRichBracket(bracket: TokenizableRichBracket): boolean {
    return this.tryToOpenConvention({
      goal: bracket.convention.tokenizerGoal,
      pattern: bracket.startPattern,
      flushBufferToPlainTextTokenBeforeOpeningConvention: true
    })
  }

  private tryToCloseRichSandwich(sandwich: TokenizableSandwich, context: TokenizerContext): boolean {
    return this.tryToCloseConvention({
      pattern: sandwich.endPattern,
      context,
      then: () => {
        const startToken = new Token({ kind: sandwich.startTokenKind })
        const endToken = new Token({ kind: sandwich.endTokenKind })
        associate (startToken, endToken)
        
        this.insertTokenAtStartOfContext(context, startToken)

        this.flushBufferToPlainTextToken()
        this.tokens.push(endToken)
      }
    })
  }

  private tryToOpenRawTextBracket(bracket: TokenizableRawTextBracket): boolean {
    return this.tryToOpenConvention({
      goal: bracket.goal,
      pattern: bracket.startPattern,
      flushBufferToPlainTextTokenBeforeOpeningConvention: false,
      thenAddAnyStartTokens: (bracket) => {
        this.buffer += bracket
      }
    })
  }

  private tryToCloseRawTextBracket(bracket: TokenizableRawTextBracket, context: TokenizerContext): boolean {
    return this.tryToCloseConvention({
      pattern: bracket.endPattern,
      context,
      then: (bracket) => {
        this.buffer += bracket
      }
    })
  }

  private tryToCloseRichBracket(bracket: TokenizableRichBracket, context: TokenizerContext): boolean {
    return this.tryToCloseConvention({
      pattern: bracket.endPattern,
      context,
      then: () => {
        this.flushBufferToPlainTextToken()
        
        // Rich brackets are unique in that their delimiters (brackets!) appear in the final AST inside the
        // bracket's node. We'll add those brackets here, along with the start and end tokens.
        
        const startToken = new Token({ kind: bracket.convention.startTokenKind })
        const endToken = new Token({ kind: bracket.convention.endTokenKind })
        associate(startToken, endToken)
        
        const startBracketToken = getPlainTextToken(bracket.rawStartBracket)
        const endBracketToken = getPlainTextToken(bracket.rawEndBracket)

        this.insertTokensAtStartOfContext(context, startToken, startBracketToken)
        this.tokens.push(endBracketToken, endToken)
      }
    })
  }

  private closeContext(
    args: {
      contextToClose: TokenizerContext,
      closeInnerContexts?: boolean,
      thenAddAnyClosingTokens: () => void
    }
  ): void {
    const { contextToClose, closeInnerContexts, thenAddAnyClosingTokens } = args

    for (let openContextIndex = this.openContexts.length - 1; openContextIndex >= 0; openContextIndex--) {
      const openContext = this.openContexts[openContextIndex]

      const foundTheContextToClose = (openContext === contextToClose)

      if (foundTheContextToClose || closeInnerContexts) {
        this.openContexts.splice(openContextIndex, 1)
      }

      if (foundTheContextToClose) {
        thenAddAnyClosingTokens()
        return
      }

      // As a rule, if a convention enclosing a naked URL is closed, the naked URL gets closed first.
      if (openContext.goal === TokenizerGoal.NakedUrl) {
        this.flushBufferToNakedUrlEndToken()
        this.openContexts.splice(openContextIndex)

        continue
      }
    }
  }

  private tryToOpenConvention(
    args: {
      goal: TokenizerGoal,
      pattern: RegExp,
      flushBufferToPlainTextTokenBeforeOpeningConvention: boolean
      thenAddAnyStartTokens?: OnTokenizerMatch
    }
  ): boolean {
    const { goal, pattern, flushBufferToPlainTextTokenBeforeOpeningConvention, thenAddAnyStartTokens } = args

    return this.canTry(goal) && this.consumer.advanceAfterMatch({
      pattern,
      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        if (flushBufferToPlainTextTokenBeforeOpeningConvention) {
          this.flushBufferToPlainTextToken()
        }

        this.openContext(goal)

        if (thenAddAnyStartTokens) {
          thenAddAnyStartTokens(match, isTouchingWordEnd, isTouchingWordStart, ...captures)
        }
      }
    })
  }

  private tryToCloseConvention(
    args: {
      pattern: RegExp,
      context: TokenizerContext
      then: OnTokenizerMatch
    }
  ): boolean {
    const {  pattern, context, then } = args

    return this.consumer.advanceAfterMatch({
      pattern,
      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        this.closeContext({
          contextToClose: context,
          thenAddAnyClosingTokens: () => {
            then(match, isTouchingWordEnd, isTouchingWordStart, ...captures)
          }
        })
      }
    })
  }

  private openContext(goal: TokenizerGoal): void {
    this.openContexts.push(new TokenizerContext(goal, this.getSnapshot()))
  }

  private getSnapshot(): TokenizerSnapshot {
    return new TokenizerSnapshot({
      textIndex: this.consumer.textIndex,
      tokens: this.tokens,
      openContexts: this.openContexts,
      bufferedText: this.buffer
    })
  }

  private resolveOpenContexts(): boolean {
    while (this.openContexts.length) {
      const context = this.openContexts.pop()

      switch (context.goal) {
        case TokenizerGoal.NakedUrl:
          this.flushBufferToNakedUrlEndToken()
          break

        // Raw bracketed text can be left unclosed
        case TokenizerGoal.ParenthesizedInRawText:
        case TokenizerGoal.SquareBracketedInRawText:
        case TokenizerGoal.CurlyBracketedInRawText:

        // TODO: Update media tokenization  
        case TokenizerGoal.MediaUrl:
          break;

        default:
          this.backtrackToBeforeContext(context)
          return false
      }
    }

    this.flushBufferToPlainTextToken()
    return true
  }

  private backtrackToBeforeContext(context: TokenizerContext): void {
    this.failedGoalTracker.registerFailure(context)

    this.tokens = context.snapshot.tokens
    this.openContexts = context.snapshot.openContexts
    this.buffer = context.snapshot.bufferedText

    this.consumer.textIndex = context.snapshot.textIndex
    
    for (const remainingContext of this.openContexts) {
      remainingContext.reset() 
    }
  }

  private failMostRecentContextWithGoalAndResetToBeforeIt(goal: TokenizerGoal): void {
    while (this.openContexts.length) {
      const context = this.openContexts.pop()

      if (context.goal === goal) {
        this.backtrackToBeforeContext(context)
        return
      }
    }
  }

  private flushBufferToNakedUrlEndToken(): void {
    const urlAfterProtocol = this.flushBuffer()

    if (urlAfterProtocol) {
      this.createTokenAndAppend({ kind: TokenKind.NakedUrlAfterProtocolAndEnd, value: urlAfterProtocol })
    }
  }

  private hasGoal(goal: TokenizerGoal): boolean {
    return this.openContexts.some(context => context.goal === goal)
  }

  private tryToTokenizeRaisedVoicePlaceholders(): boolean {
    return this.consumer.advanceAfterMatch({
      pattern: RAISED_VOICE_DELIMITER_PATTERN,

      then: (asterisks, isTouchingWordEnd, isTouchingWordStart) => {
        // If the previous character in the raw source text was whitespace, this token cannot end any raised-voice
        // conventions. That's because the token needs to look like it's touching the end of the text it's affecting.
        //
        // We're only concerned with how the asterisks appear in the surrounding raw text. Therefore, at least for now,
        // we don't care whether any preceding whitespace is escaped or not.
        const canCloseConvention = isTouchingWordEnd

        // Likewise, a token cannot begin any raised-voice conventions if the next character in the raw source text 
        // is whitespace. That's because the token must look like it's touching the beginning of the text it's
        // affecting. At least for now, the next raw character can even be a backslash!
        const canOpenConvention = isTouchingWordStart

        let asteriskTokenKind = TokenKind.PlainText

        if (canOpenConvention && canCloseConvention) {
          asteriskTokenKind = TokenKind.PotentialRaisedVoiceStartOrEnd
        } else if (canOpenConvention) {
          asteriskTokenKind = TokenKind.PotentialRaisedVoiceStart
        } else if (canCloseConvention) {
          asteriskTokenKind = TokenKind.PotentialRaisedVoiceEnd
        }

        this.flushBufferToPlainTextToken()
        this.createTokenAndAppend({ kind: asteriskTokenKind, value: asterisks })
      }
    })
  }

  private createTokenAndAppend(args: NewTokenArgs): void {
    this.tokens.push(new Token(args))
  }

  private insertTokenAtStartOfContext(context: TokenizerContext, token: Token): void {
    const newTokenIndex = context.initialTokenIndex

    this.tokens.splice(newTokenIndex, 0, token)

    for (const openContext of this.openContexts) {
      if (openContext !== context) {
        openContext.registerTokenInsertion({ atIndex: newTokenIndex })
      }
    }
  }


  private insertTokensAtStartOfContext(context: TokenizerContext, ...tokens: Token[]): void {
    // When we insert a token at the start of a context through `insertTokenAtStartOfContext`, that context's start
    // index isn't affected. To preserve the order the tokens appear in `tokens`, we'll insert them in reverse.
    for (let i = tokens.length - 1; i >= 0; i--) {
      const token = tokens[i]
      this.insertTokenAtStartOfContext(context, token)
    }
  }

  // This method always returns true, which allows us to use some cleaner boolean logic.
  private bufferCurrentChar(): boolean {
    this.buffer += this.consumer.currentChar
    this.consumer.advanceTextIndex(1)

    return true
  }

  private flushBuffer(): string {
    const buffer = this.buffer
    this.buffer = ''

    return buffer
  }

  private flushBufferToPlainTextToken(): void {
    const buffer = this.flushBuffer()

    if (buffer) {
      this.tokens.push(getPlainTextToken(buffer))
    }
  }

  private canTry(goal: TokenizerGoal, textIndex = this.consumer.textIndex): boolean {
    return !this.failedGoalTracker.hasFailed(goal, textIndex)
  }
}


function getRichSandwich(
  args: {
    startPattern: string,
    endPattern: string,
    richConvention: RichConvention
  }
): TokenizableSandwich {
  const { startPattern, endPattern, richConvention } = args

  return new TokenizableSandwich({
    goal: richConvention.tokenizerGoal,
    startPattern,
    endPattern,
    startTokenKind: richConvention.startTokenKind,
    endTokenKind: richConvention.endTokenKind
  })
}


const PARENTHESIS =
  new Bracket('(', ')')

const SQUARE_BRACKET =
  new Bracket('[', ']')

const CURLY_BRACKET =
  new Bracket('{', '}')


const INLINE_CODE_DELIMITER_PATTERN = new RegExp(
  startsWith('`'))

const RAISED_VOICE_DELIMITER_PATTERN = new RegExp(
  startsWith(atLeast(1, escapeForRegex('*'))))

const URL_ARROW_PATTERN_DEPCRECATED = new RegExp(
  startsWith(ANY_WHITESPACE + '->' + ANY_WHITESPACE))

const MEDIA_END_PATTERN_DEPCRECATED = new RegExp(
  startsWith(SQUARE_BRACKET.endPattern))

const NAKED_URL_PROTOCOL_PATTERN = new RegExp(
  startsWith('http' + optional('s') + '://'))

const WHITESPACE_CHAR_PATTERN = new RegExp(
  WHITESPACE_CHAR)

const NON_WHITESPACE_CHAR_PATTERN = new RegExp(
  NON_WHITESPACE_CHAR)

const CLOSE_SQUARE_BRACKET_PATTERN = new RegExp(
  startsWith(SQUARE_BRACKET.endPattern)
)


function getPlainTextToken(value: string) {
  return new Token({ kind: TokenKind.PlainText, value })
}

function associate(startToken: Token, endToken: Token): void {
  startToken.correspondsToToken = endToken
  endToken.correspondsToToken = startToken
}