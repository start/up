import { escapeForRegex, startsWith, optional, atLeast, ANY_WHITESPACE, WHITESPACE_CHAR } from '../../Patterns'
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
import { TokenizableRichSandwich } from './TokenizableRichSandwich'
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
  // flushed to a token, usually a PlainTextToken.
  private buffer = ''

  private richBrackets = [
    { convention: PARENTHESIZED, bracket: PARENTHESIS },
    { convention: SQUARE_BRACKETED, bracket: SQUARE_BRACKET }
  ].map(args => new TokenizableRichBracket(args))

  // Unlike the rich bracket conventions, raw text bracket conventions don't produce special tokens.
  //
  // They can only appear inside URLs or media conventions' descriptions, and they allow matching
  // brackets to be included without having to escape any closing brackets.
  private rawTextBrackets = [
    { goal: TokenizerGoal.ParenthesizedInRawText, bracket: PARENTHESIS },
    { goal: TokenizerGoal.SquareBracketedInRawText, bracket: SQUARE_BRACKET },
    { goal: TokenizerGoal.CurlyBracketedInRawText, bracket: CURLY_BRACKET }
  ].map(args => new TokenizableRawTextBracket(args))

  // A rich sandwich:
  //
  // 1. Can contain other inline conventions
  // 2. Involves just two delimiters: one to mark its start, and one to mark its end
  //
  // Some of rich sandwiches rely on user-configurable values, so we assign this field in the
  // `configureConventions` method where we have access to the user's config settings.
  private richSandwiches: TokenizableRichSandwich[]

  // These conventions are for images, audio, and video. They also rely on user-configurable values.
  private mediaConventions: TokenizableMedia[]

  constructor(entireText: string, config: UpConfig) {
    this.consumer = new InlineConsumer(entireText)
    this.configureConventions(config)

    this.tokenize()
  }

  private configureConventions(config: UpConfig): void {
    this.mediaConventions =
      [AUDIO, IMAGE, VIDEO].map(media =>
        new TokenizableMedia(media, config.localizeTerm(media.nonLocalizedTerm)))

    this.richSandwiches = [
      {
        richConvention: SPOILER,
        startPattern: SQUARE_BRACKET.startPattern + escapeForRegex(config.settings.i18n.terms.spoiler) + ':' + ANY_WHITESPACE,
        endPattern: SQUARE_BRACKET.endPattern
      }, {
        richConvention: FOOTNOTE,
        startPattern: ANY_WHITESPACE + escapeForRegex('(('),
        endPattern: escapeForRegex('))')
      }, {
        richConvention: REVISION_DELETION,
        startPattern: '~~',
        endPattern: '~~'
      }, {
        richConvention: REVISION_INSERTION,
        startPattern: escapeForRegex('++'),
        endPattern: escapeForRegex('++')
      }, {
        richConvention: ACTION,
        startPattern: CURLY_BRACKET.startPattern,
        endPattern: CURLY_BRACKET.endPattern
      }
    ].map(args => new TokenizableRichSandwich(args))
  }

  private tokenize(): void {
    while (!this.isDone()) {

      this.tryToCollectEscapedChar()
        || this.tryToCloseOrAdvanceAnyOpenContext()
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
      this.tryToOpenAnyRichSandwich()
      || this.tryToOpenAnyRichBracket()
      || this.tryToOpenInlineCode()
      || this.tryToOpenNakedUrl())
  }

  private isDone(): boolean {
    return this.consumer.reachedEndOfText() && this.resolveOpenContexts()
  }

  private tryToCloseOrAdvanceAnyOpenContext(): boolean {
    for (let i = this.openContexts.length - 1; i >= 0; i--) {
      if (this.tryToCloseOrAdvanceContext(this.openContexts[i])) {
        return true
      }
    }

    return false
  }

  private tryToCloseOrAdvanceContext(context: TokenizerContext): boolean {
    const { goal } = context

    return (
      this.tryToCloseRichSandwichCorrespondingToContext(context)
      || this.tryToCloseRichBracketCorrespondingToContext(context)
      || this.tryToCloseRawTextBracketCorrespondingToContext(context)
      || ((goal === TokenizerGoal.InlineCode) && this.closeInlineCodeOrAppendCurrentChar(context))
      || ((goal === TokenizerGoal.NakedUrl) && this.tryToCloseNakedUrl(context))
    )
  }

  private closeInlineCodeOrAppendCurrentChar(context: TokenizerContext): boolean {
    return this.tryToCloseInlineCode(context) || this.bufferCurrentChar()
  }

  private tryToOpenInlineCode(): boolean {
    return this.tryToOpenContext({
      goal: TokenizerGoal.InlineCode,
      pattern: INLINE_CODE_DELIMITER_PATTERN,
      flushBufferToPlainTextTokenBeforeOpening: true
    })
  }

  private tryToCloseInlineCode(context: TokenizerContext): boolean {
    return this.tryToCloseContext({
      context,
      pattern: INLINE_CODE_DELIMITER_PATTERN,
      onCloseFlushBufferTo: TokenKind.InlineCode
    })
  }

  private appendCharToNakedUrl(): boolean {
    return (
      this.tryToOpenAnyRawTextBracket()
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

  private tryToOpenAnyRichSandwich(): boolean {
    return this.richSandwiches.some(sandwich => this.tryToOpenRichSandwich(sandwich))
  }

  private tryToOpenAnyRichBracket(): boolean {
    return this.richBrackets.some(bracket => this.tryToOpenRichBracket(bracket))
  }

  private tryToOpenAnyRawTextBracket(): boolean {
    return this.rawTextBrackets.some(bracket => this.tryToOpenRawTextBracket(bracket))
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
    return this.tryToOpenContext({
      goal: TokenizerGoal.NakedUrl,
      pattern: NAKED_URL_PROTOCOL_PATTERN,
      flushBufferToPlainTextTokenBeforeOpening: true,
      thenAddAnyStartTokens: urlProtocol => {
        this.createTokenAndAppend({ kind: TokenKind.NakedUrlProtocolAndStart, value: urlProtocol })
      }
    })
  }

  private tryToCloseNakedUrl(context: TokenizerContext): boolean {
    // Whitespace terminates naked URLs, but we don't advance past the whitespace character.
    //
    // Instead, we leave the whitespace to be matched by another convention (e.g. a footnote, which consumes any
    // leading whitespace).
    if (WHITESPACE_CHAR_PATTERN.test(this.consumer.currentChar)) {
      this.closeContext({
        context,
        closeInnerContexts: true,
        thenAddAnyClosingTokens: () => {
          this.flushBufferToNakedUrlEndToken()
        }
      })

      return true
    }

    return false
  }

  private tryToOpenRichSandwich(sandwich: TokenizableRichSandwich): boolean {
    return this.tryToOpenContext({
      goal: sandwich.goal,
      pattern: sandwich.startPattern,
      flushBufferToPlainTextTokenBeforeOpening: true
    })
  }

  private tryToOpenRichBracket(bracket: TokenizableRichBracket): boolean {
    return this.tryToOpenContext({
      goal: bracket.convention.tokenizerGoal,
      pattern: bracket.startPattern,
      flushBufferToPlainTextTokenBeforeOpening: true
    })
  }

  private tryToCloseRichSandwich(sandwich: TokenizableRichSandwich, context: TokenizerContext): boolean {
    return this.tryToCloseContext({
      pattern: sandwich.endPattern,
      context,
      thenAddAnyClosingTokens: () => {
        this.flushBufferToPlainTextToken()

        const startToken = new Token({ kind: sandwich.startTokenKind })
        const endToken = new Token({ kind: sandwich.endTokenKind })
        startToken.associateWith(endToken)

        this.insertTokenAtStartOfContext(context, startToken)
        this.tokens.push(endToken)
      }
    })
  }

  private tryToOpenRawTextBracket(bracket: TokenizableRawTextBracket): boolean {
    return this.tryToOpenContext({
      goal: bracket.goal,
      pattern: bracket.startPattern,
      flushBufferToPlainTextTokenBeforeOpening: false,
      thenAddAnyStartTokens: bracket => { this.buffer += bracket }
    })
  }

  private tryToCloseRawTextBracket(bracket: TokenizableRawTextBracket, context: TokenizerContext): boolean {
    return this.tryToCloseContext({
      context,
      pattern: bracket.endPattern,
      thenAddAnyClosingTokens: bracket => { this.buffer += bracket }
    })
  }

  private tryToCloseRichBracket(bracket: TokenizableRichBracket, context: TokenizerContext): boolean {
    return this.tryToCloseContext({
      context,
      pattern: bracket.endPattern,
      onCloseFlushBufferTo: TokenKind.PlainText,
      thenAddAnyClosingTokens: () => {
        const startToken = new Token({ kind: bracket.convention.startTokenKind })
        const endToken = new Token({ kind: bracket.convention.endTokenKind })
        startToken.associateWith(endToken)

        // Rich brackets are unique in that their delimiters (brackets) appear in the final AST inside the
        // bracket's node.
        const startBracketToken = getPlainTextToken(bracket.rawStartBracket)
        const endBracketToken = getPlainTextToken(bracket.rawEndBracket)

        this.insertTokensAtStartOfContext(context, startToken, startBracketToken)
        this.tokens.push(endBracketToken, endToken)
      }
    })
  }

  private closeContext(
    args: {
      context: TokenizerContext,
      closeInnerContexts?: boolean,
      thenAddAnyClosingTokens: () => void
    }
  ): void {
    const { closeInnerContexts, thenAddAnyClosingTokens } = args
    const contextToClose = args.context

    for (let i = this.openContexts.length - 1; i >= 0; i--) {
      const openContext = this.openContexts[i]
      const foundTheContextToClose = (openContext === contextToClose)

      if (foundTheContextToClose || closeInnerContexts) {
        this.openContexts.splice(i, 1)
      }

      if (foundTheContextToClose) {
        thenAddAnyClosingTokens()
        return
      }

      // As a rule, if a convention enclosing a naked URL is closed, the naked URL gets closed first.
      if (openContext.goal === TokenizerGoal.NakedUrl) {
        this.flushBufferToNakedUrlEndToken()
        this.openContexts.splice(i)
      }
    }
  }

  private tryToOpenContext(
    args: {
      goal: TokenizerGoal,
      pattern: RegExp,
      flushBufferToPlainTextTokenBeforeOpening: boolean
      thenAddAnyStartTokens?: OnTokenizerMatch
    }
  ): boolean {
    const { goal, pattern, flushBufferToPlainTextTokenBeforeOpening, thenAddAnyStartTokens } = args

    return this.canTry(goal) && this.consumer.advanceAfterMatch({
      pattern,
      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        if (flushBufferToPlainTextTokenBeforeOpening) {
          this.flushBufferToPlainTextToken()
        }

        this.openContexts.push(new TokenizerContext(goal, this.getSnapshot()))

        if (thenAddAnyStartTokens) {
          thenAddAnyStartTokens(match, isTouchingWordEnd, isTouchingWordStart, ...captures)
        }
      }
    })
  }

  private tryToCloseContext(
    args: {
      context: TokenizerContext,
      pattern: RegExp,
      onCloseFlushBufferTo?: TokenKind
      thenAddAnyClosingTokens?: OnTokenizerMatch
    }
  ): boolean {
    const {  context, pattern, onCloseFlushBufferTo, thenAddAnyClosingTokens } = args

    return this.consumer.advanceAfterMatch({
      pattern,
      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        this.closeContext({
          context,
          thenAddAnyClosingTokens: () => {
            if (onCloseFlushBufferTo != null) {
              this.flushBufferToTokenOfKind(onCloseFlushBufferTo)
            }

            if (thenAddAnyClosingTokens) {
              thenAddAnyClosingTokens(match, isTouchingWordEnd, isTouchingWordStart, ...captures)
            }
          }
        })
      }
    })
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

  private flushBufferToNakedUrlEndToken(): void {
    this.flushBufferToTokenOfKind(TokenKind.NakedUrlAfterProtocolAndEnd)
  }

  private flushBufferToTokenOfKind(kind: TokenKind): void {
    this.createTokenAndAppend({ kind, value: this.flushBuffer() })
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
      openContext.registerTokenInsertion({ atIndex: newTokenIndex, forContext: context })
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

  // This method always returns true. Why?
  //
  // It allows us to cleanly chain it with other boolean tokenizer methods, using this method as a last resort. 
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
    this.flushBufferToTokenOfKind(TokenKind.PlainText)
  }

  private canTry(goal: TokenizerGoal, textIndex = this.consumer.textIndex): boolean {
    return !this.failedGoalTracker.hasFailed(goal, textIndex)
  }
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

const NAKED_URL_PROTOCOL_PATTERN = new RegExp(
  startsWith('http' + optional('s') + '://'))

const WHITESPACE_CHAR_PATTERN = new RegExp(
  WHITESPACE_CHAR)


function getPlainTextToken(value: string) {
  return new Token({ kind: TokenKind.PlainText, value })
}