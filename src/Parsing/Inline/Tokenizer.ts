import { escapeForRegex, startsWith, optional, atLeast, ANY_WHITESPACE, WHITESPACE_CHAR, NON_WHITESPACE_CHAR, OPEN_PAREN, CLOSE_PAREN, OPEN_SQUARE_BRACKET, CLOSE_SQUARE_BRACKET, OPEN_CURLY_BRACKET, CLOSE_CURLY_BRACKET } from '../../Patterns'
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
import { TokenizableMedia } from './TokenizableMedia'
import { FailedGoalTracker } from './FailedGoalTracker'
import { TokenizerContext } from './TokenizerContext'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { InlineConsumer } from './InlineConsumer'
import { TokenKind } from './TokenKind'
import { Token } from './Token'


export class Tokenizer {
  tokens: Token[] = []

  private consumer: InlineConsumer
  // Any time we open a new convention, we add it to `openContexts`.
  //
  // Most conventions need to be closed by the time we consume the last character of the text.
  private openContexts: TokenizerContext[] = []

  private failedGoalTracker: FailedGoalTracker = new FailedGoalTracker()

  // The this buffer is for any text that isn't consumed by special delimiters. Eventually, the buffer gets
  // flushed to a token, asually a PlainTextToken.
  private buffer = ''

  private footnoteConvention = this.getRichSandwich({
    richConvention: FOOTNOTE,
    startPattern: ANY_WHITESPACE + escapeForRegex('(('),
    endPattern: escapeForRegex('))')
  })

  private revisionDeletionConvention = this.getRichSandwich({
    richConvention: REVISION_DELETION,
    startPattern: '~~',
    endPattern: '~~'
  })

  private revisionInsertionConvention = this.getRichSandwich({
    richConvention: REVISION_INSERTION,
    startPattern: escapeForRegex('++'),
    endPattern: escapeForRegex('++')
  })

  private actionConvention = this.getRichSandwich({
    richConvention: ACTION,
    startPattern: OPEN_CURLY_BRACKET,
    endPattern: CLOSE_CURLY_BRACKET,
  })

  private parenthesizedConvention = this.getRichSandwich({
    richConvention: PARENTHESIZED,
    startPattern: OPEN_PAREN,
    endPattern: CLOSE_PAREN,
  })

  private squareBracketedConvention = this.getRichSandwich({
    richConvention: SQUARE_BRACKETED,
    startPattern: OPEN_SQUARE_BRACKET,
    endPattern: CLOSE_SQUARE_BRACKET,
  })

  // Unlike the other bracket conventions, these don't produce special tokens. They can only appear inside URLs
  // or media conventions' descriptions.  

  private parenthesizedRawTextConvention = new TokenizableSandwich({
    goal: TokenizerGoal.ParenthesizedInRawText,
    startPattern: OPEN_PAREN,
    endPattern: CLOSE_PAREN
  })

  private squareBracketedRawTextConvention = new TokenizableSandwich({
    goal: TokenizerGoal.SquareBracketedInRawText,
    startPattern: OPEN_SQUARE_BRACKET,
    endPattern: CLOSE_SQUARE_BRACKET
  })

  private curlyBracketedRawTextConvention = new TokenizableSandwich({
    goal: TokenizerGoal.CurlyBracketedInRawText,
    startPattern: OPEN_CURLY_BRACKET,
    endPattern: CLOSE_CURLY_BRACKET
  })

  private rawTextBrackets = [
    this.parenthesizedRawTextConvention,
    this.squareBracketedRawTextConvention,
    this.curlyBracketedRawTextConvention
  ]

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
      this.getRichSandwich({
        richConvention: SPOILER,
        startPattern: OPEN_SQUARE_BRACKET + escapeForRegex(config.settings.i18n.terms.spoiler) + ':' + ANY_WHITESPACE,
        endPattern: CLOSE_SQUARE_BRACKET
      })

    this.richSandwiches = [
      this.spoilerConvention,
      this.footnoteConvention,
      this.revisionDeletionConvention,
      this.revisionInsertionConvention,
      this.actionConvention,
      this.parenthesizedConvention,
      this.squareBracketedConvention
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
        applyRaisedVoices(
          this.insertPlainTextTokensForBrackets()))
  }

  private tryToOpenAnyConvention(): boolean {
    return (
      this.tryToOpenMedia()
      || this.tryToOpenInlineCode()
      || this.tryToOpenAnySandwichThatCanAppearInRegularContent()
      || this.tryToOpenNakedUrl())
  }

  private isDone(): boolean {
    return this.consumer.reachedEndOfText() && this.resolveOpenContexts()
  }

  private tryToCloseAnyOpenContext(): boolean {
    // As a rule, if a convention enclosing a naked URL is closed, the naked URL gets closed, too (along with
    // any of its inner raw text brackets).
    let innerNakedUrlContext: TokenizerContext

    for (let i = this.openContexts.length - 1; i >= 0; i--) {
      const context = this.openContexts[i]

      if (this.tryToCloseContext(context)) {
        if (innerNakedUrlContext) {
          this.closeNakedUrl(innerNakedUrlContext)
        }

        return true
      }
      
      if (context.goal === TokenizerGoal.NakedUrl) {
        innerNakedUrlContext = context
      }
    }

    return false
  }

  private tryToCloseContext(context: TokenizerContext): boolean {
    const { goal } = context

    return (
      this.tryToCloseRichSandwichCorrespondingToGoal(goal)
      || this.handleMediaCorrespondingToGoal(goal)
      || this.tryToCloseRawTextBracketCorrespondingToContext(context)
      || ((goal === TokenizerGoal.InlineCode) && this.closeInlineCodeOrAppendCurrentChar(context))
      || ((goal === TokenizerGoal.MediaUrl) && this.closeMediaOrAppendCharToUrl())
      || ((goal === TokenizerGoal.NakedUrl)) && this.tryToCloseNakedUrl(context)
    )
  }

  private closeInlineCodeOrAppendCurrentChar(context: TokenizerContext): boolean {
    return this.tryToCloseInlineCode(context) || this.bufferCurrentChar()
  }

  private tryToOpenInlineCode(): boolean {
    return this.tryToOpenConvention({
      goal: TokenizerGoal.InlineCode,
      pattern: INLINE_CODE_DELIMITER_PATTERN,
      then: () => {
        this.flushBufferToPlainTextToken()
      }
    })
  }

  private tryToCloseInlineCode(context: TokenizerContext): boolean {
    return this.consumer.advanceAfterMatch({
      pattern: INLINE_CODE_DELIMITER_PATTERN,
      then: () => {
        this.addToken(TokenKind.InlineCode, this.flushBuffer())
        this.closeContext(context)
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

  private closeMediaOrAppendCharToUrl(): boolean {
    return (
      this.tryToOpenSquareBracketedRawText()
      || this.tryToCloseMedia()
      || this.bufferCurrentChar())
  }

  private tryToCloseRichSandwichCorrespondingToGoal(goal: TokenizerGoal): boolean {
    return this.richSandwiches.some(sandwich =>
      (sandwich.goal === goal)
      && this.tryToCloseRichSandwich(sandwich))
  }

  private tryToCloseRawTextBracketCorrespondingToContext(context: TokenizerContext): boolean {
    return this.rawTextBrackets.some(rawTextBracket =>
      (rawTextBracket.goal === context.goal)
      && this.tryToCloseRawTextBracket(rawTextBracket, context))
  }

  private handleMediaCorrespondingToGoal(goal: TokenizerGoal): boolean {
    return this.mediaConventions
      .some(media => (media.goal === goal) && this.handleMedia(media))
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

  private tryToOpenAnySandwichThatCanAppearInRegularContent(): boolean {
    return this.richSandwiches
      .some(sandwich => this.tryToOpenRichSandwich(sandwich))
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
      pattern: NAKED_URL_START_PATTERN,
      then: urlProtocol => {
        this.addTokenAfterFlushingBufferToPlainTextToken(TokenKind.NakedUrlProtocolAndStart, urlProtocol)
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
      this.closeNakedUrl(context)
      return true
    }

    return false
  }

  private tryToOpenMedia(): boolean {
    return this.mediaConventions.some(media => {
      return this.tryToOpenConvention({
        goal: media.goal,
        pattern: media.startPattern,
        then: () => {
          this.addTokenAfterFlushingBufferToPlainTextToken(media.startTokenKind)
        }
      })
    })
  }

  private tryToOpenMediaUrl(): boolean {
    return this.tryToOpenConvention({
      goal: TokenizerGoal.MediaUrl,
      pattern: URL_ARROW_PATTERN_DEPCRECATED,
      then: () => {
        this.addToken(TokenKind.MediaDescription, this.flushBuffer())
      }
    })
  }

  private tryToCloseMedia(): boolean {
    return this.consumer.advanceAfterMatch({
      pattern: MEDIA_END_PATTERN_DEPCRECATED,
      then: () => {
        this.addToken(TokenKind.MediaUrlAndEnd, this.flushBuffer())
        this.closeMostRecentContextWithGoal(TokenizerGoal.MediaUrl)

        // Once the media URL's context is closed, the media's context is guaranteed to be innermost.
        this.openContexts.pop()
      }
    })
  }

  private closeNakedUrl(context: TokenizerContext): void {
    this.flushBufferedTextToNakedUrlToken()

    // There could be some bracket contexts opened inside the naked URL, and we don't want them to have any impact on
    // any text that follows the URL.
    this.closeContextAndAnyInnerContexts(context)
  }

  private tryToOpenRichSandwich(sandwich: TokenizableSandwich): boolean {
    return this.tryToOpenConvention({
      goal: sandwich.goal,
      pattern: sandwich.startPattern,
      then: () => { this.addTokenAfterFlushingBufferToPlainTextToken(sandwich.startTokenKind) }
    })
  }

  private tryToCloseRichSandwich(sandwich: TokenizableSandwich): boolean {
    return this.consumer.advanceAfterMatch({
      pattern: sandwich.endPattern,
      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        this.addTokenAfterFlushingBufferToPlainTextToken(sandwich.endTokenKind)
        this.closeMostRecentContextWithGoal(sandwich.goal)
      }
    })
  }

  private tryToOpenRawTextBracket(sandwich: TokenizableSandwich): boolean {
    return this.tryToOpenConvention({
      goal: sandwich.goal,
      pattern: sandwich.startPattern,
      then: (bracket) => { this.buffer += bracket }
    })
  }

  private tryToCloseRawTextBracket(bracket: TokenizableSandwich, context: TokenizerContext): boolean {
    return this.tryToCloseConvention({
      pattern: bracket.endPattern,
      context,
      then: (bracket) => { this.buffer += bracket }
    })
  }

  private closeContext(context: TokenizerContext): void {
    remove(this.openContexts, context)
  }

  private closeContextAndAnyInnerContexts(context: TokenizerContext): void {
    while (this.openContexts.length) {
      if (this.openContexts.pop() === context) {
        return
      }
    }
  }

  private tryToOpenConvention(
    args: {
      goal: TokenizerGoal,
      pattern: RegExp,
      then: OnTokenizerMatch
    }
  ): boolean {
    const { goal, pattern, then } = args

    return this.canTry(goal) && this.consumer.advanceAfterMatch({
      pattern,
      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        this.openContext(goal)
        then(match, isTouchingWordEnd, isTouchingWordStart, ...captures)
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
        then(match, isTouchingWordEnd, isTouchingWordStart, ...captures)
        this.closeContext(context)
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
          this.flushBufferedTextToNakedUrlToken()
          break

        // Parentheses and brackets can be left unclosed.
        case TokenizerGoal.Parenthesized:
        case TokenizerGoal.SquareBracketed:
        case TokenizerGoal.ParenthesizedInRawText:
        case TokenizerGoal.SquareBracketedInRawText:
        case TokenizerGoal.CurlyBracketedInRawText:

        // The same applies for media URLs.
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
    context.reset()

    this.failedGoalTracker.registerFailure(context)

    this.tokens = context.snapshot.tokens
    this.openContexts = context.snapshot.openContexts
    this.buffer = context.snapshot.bufferedText

    this.consumer.textIndex = context.snapshot.textIndex
  }

  private failMostRecentContextWithGoalAndResetToBeforeIt(goal: TokenizerGoal): void {
    while (this.openContexts.length) {
      const context = this.openContexts.pop()

      if (context.goal === goal) {
        this.backtrackToBeforeContext(context)
        return
      }
    }

    throw new Error(`Goal was missing: ${TokenizerGoal[goal]}`)
  }

  private closeMostRecentContextWithGoal(goal: TokenizerGoal): void {
    for (let i = this.openContexts.length - 1; i >= 0; i--) {
      const context = this.openContexts[i]

      if (context.goal === goal) {
        this.openContexts.splice(i, 1)
        return
      }
    }

    throw new Error(`Goal was missing: ${TokenizerGoal[goal]}`)
  }

  private flushBufferedTextToNakedUrlToken(): void {
    this.addToken(TokenKind.NakedUrlAfterProtocolAndEnd, this.flushBuffer())
  }

  private addTokenAfterFlushingBufferToPlainTextToken(kind: TokenKind, value?: string): void {
    this.flushBufferToPlainTextToken()
    this.addToken(kind, value)
  }

  private hasGoal(goal: TokenizerGoal): boolean {
    return this.openContexts.some(context => context.goal === goal)
  }

  private getRichSandwich(
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

        this.addTokenAfterFlushingBufferToPlainTextToken(asteriskTokenKind, asterisks)
      }
    })
  }

  private insertPlainTextTokensForBrackets(): Token[] {
    const resultTokens: Token[] = []

    for (const token of this.tokens) {
      function addBracketIfTokenIs(bracket: string, tokenKind: TokenKind): void {
        if (token.kind === tokenKind) {
          resultTokens.push(new Token(TokenKind.PlainText, bracket))
        }
      }

      addBracketIfTokenIs(')', PARENTHESIZED.endTokenKind)
      addBracketIfTokenIs(']', SQUARE_BRACKETED.endTokenKind)

      resultTokens.push(token)

      addBracketIfTokenIs('(', PARENTHESIZED.startTokenKind)
      addBracketIfTokenIs('[', SQUARE_BRACKETED.startTokenKind)
    }

    return resultTokens
  }

  private addToken(kind: TokenKind, value?: string): void {
    this.tokens.push(new Token(kind, value))
  }

  private insertToken(
    args: {
      atIndex: number
      kind: TokenKind
      forContext: TokenizerContext
      value?: string,
    }
  ): void {
    const { atIndex, kind, forContext, value } = args

    this.tokens.splice(atIndex, 0, new Token(kind, value))

    for (const context of this.openContexts) {
      if (context != forContext) {
        context.registerTokenInsertion({ atIndex })
      }
    }
  }

  // This method always returns true, which allows us to use some cleaner boolean logic.
  private bufferCurrentChar(): boolean {
    this.buffer += this.consumer.currentChar
    this.consumer.advanceTextIndex(1)

    return true
  }

  private flushBuffer(): string {
    const bufferedText = this.buffer
    this.buffer = ''

    return bufferedText
  }

  private flushBufferToPlainTextToken(): void {
    // This will create a PlainTextToken even when there isn't any text to flush.
    //
    // TODO: Explain why this is helpful
    this.addToken(TokenKind.PlainText, this.flushBuffer())
  }

  private canTry(goal: TokenizerGoal, textIndex = this.consumer.textIndex): boolean {
    return !this.failedGoalTracker.hasFailed(goal, textIndex)
  }
}



const INLINE_CODE_DELIMITER_PATTERN = new RegExp(
  startsWith('`'))

const RAISED_VOICE_DELIMITER_PATTERN = new RegExp(
  startsWith(atLeast(1, escapeForRegex('*'))))

const URL_ARROW_PATTERN_DEPCRECATED = new RegExp(
  startsWith(ANY_WHITESPACE + '->' + ANY_WHITESPACE))

const MEDIA_END_PATTERN_DEPCRECATED = new RegExp(
  startsWith(CLOSE_SQUARE_BRACKET))

const NAKED_URL_START_PATTERN = new RegExp(
  startsWith('http' + optional('s') + '://'))

const WHITESPACE_CHAR_PATTERN = new RegExp(
  WHITESPACE_CHAR)

const NON_WHITESPACE_CHAR_PATTERN = new RegExp(
  NON_WHITESPACE_CHAR)

const CLOSE_SQUARE_BRACKET_PATTERN = new RegExp(
  startsWith(CLOSE_SQUARE_BRACKET)
)
