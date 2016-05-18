import { escapeForRegex, startsWith, optional, atLeast, ANY_WHITESPACE, WHITESPACE_CHAR, NON_WHITESPACE_CHAR, OPEN_PAREN, CLOSE_PAREN, OPEN_SQUARE_BRACKET, CLOSE_SQUARE_BRACKET } from '../Patterns'
import { REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE, LINK, PARENTHESIZED, SQUARE_BRACKETED } from './RichConventions'
import { AUDIO, IMAGE, VIDEO } from './MediaConventions'
import { UpConfig } from '../../UpConfig'
import { RichConvention } from './RichConvention'
import { MediaConvention } from './MediaConvention'
import { applyRaisedVoices }  from './RaisedVoices/applyRaisedVoices'
import { nestOverlappingConventions } from './nestOverlappingConventions'
import { OnTokenizerMatch } from './OnTokenizerMatch'
import { last, reverse } from '../../CollectionHelpers'
import { MediaToken } from './Tokens/MediaToken'
import { TokenizerState } from './TokenizerState'
import { TokenizableSandwich } from './TokenizableSandwich'
import { TokenizerContextBehavior } from './TokenizerContextBehavior'
import { TokenizableMedia } from './TokenizableMedia'
import { FailedStateTracker } from './FailedStateTracker'
import { TokenizerContext } from './TokenizerContext'
import { Token } from './Tokens/Token'
import { TokenType } from './Tokens/TokenType'
import { InlineCodeToken } from './Tokens/InlineCodeToken'
import { PlainTextToken } from './Tokens/PlainTextToken'
import { NakedUrlToken } from './Tokens/NakedUrlToken'
import { PotentialRaisedVoiceTokenType } from './Tokens/PotentialRaisedVoiceToken'
import { PotentialRaisedVoiceEndToken } from './Tokens/PotentialRaisedVoiceEndToken'
import { PotentialRaisedVoiceStartOrEndToken } from './Tokens/PotentialRaisedVoiceStartOrEndToken'
import { PotentialRaisedVoiceStartToken } from './Tokens/PotentialRaisedVoiceStartToken'


export function tokenize(text: string, config: UpConfig): Token[] {
  return new Tokenizer(text, config).tokens
}


class Tokenizer {
  tokens: Token[] = []

  private textIndex = 0

  // These three fields are computer every time we updatae `textIndex`.
  private currentChar: string
  private remainingText: string
  private isTouchingWordEnd: boolean

  // This field is updatede very time we add a new token
  private currentToken: Token

  // Any time we open a new convention, we add it to `openContexts`.
  //
  // Most conventions need to be closed by the time we consume the last character of the text.
  private openContexts: TokenizerContext[] = []

  private failedStateTracker: FailedStateTracker = new FailedStateTracker()

  // The tokenizer collects any text that isn't consumed by special delimiters. Eventually, this text is
  // flushed to a token.
  //
  // Usually, it's flushed to a PlainTextToken, but it can also be flushed to other kinds of tokens (like
  // InlineCodeTokens).
  private bufferedText = ''

  private inlineCodeConvention: TokenizableSandwich
  private footnoteConvention: TokenizableSandwich
  private spoilerConvention: TokenizableSandwich
  private revisionDeletionConvention: TokenizableSandwich
  private revisionInsertionConvention: TokenizableSandwich

  // These conventions ensure ensure that any conventions whose delimiters contain parentheses or square
  // brackets can contain parenthesized or "square bracketed" content.
  private parenthesizedConvention: TokenizableSandwich
  private squareBracketedConvention: TokenizableSandwich

  // These conventions serve the same function for URLs.
  private parenthesizedInsideUrlConvention: TokenizableSandwich
  private squareBracketedInsideUrlConvention: TokenizableSandwich

  // These conventions are for images, audio, and video
  private mediaConventions: TokenizableMedia[]


  private inlineCodeBehavior = {
    mustClose: true,
    onOpen: () => this.flushBufferToPlainTextToken(),
    onClose: () => this.addToken(new InlineCodeToken(this.flushBufferedText())),
  }

  private footnoteBehavior = this.getRichSandwichBehavior(FOOTNOTE)
  private spoilerBehavior = this.getRichSandwichBehavior(SPOILER)
  private revisionDeletionBehavior = this.getRichSandwichBehavior(REVISION_DELETION)
  private revisionInsertionBehavior = this.getRichSandwichBehavior(REVISION_INSERTION)
  private parenthesizedBehavior = this.getRichSandwichBehavior(PARENTHESIZED)
  private squareBracketedBehavior = this.getRichSandwichBehavior(SQUARE_BRACKETED)

  private squareBracketedInsideUrlBehavior = this.getBracketInsideUrlBehavior()

  private audioBehavior = this.getMediaBehavior(AUDIO)
  private imageBehavior = this.getMediaBehavior(IMAGE)
  private videoBehavior = this.getMediaBehavior(VIDEO)

  private nakedUrlBehavior: TokenizerContextBehavior = {
    mustClose: false,
    onOpen: (urlProtocol) => {
      this.addTokenAfterFlushingBufferToPlainTextToken(new NakedUrlToken(urlProtocol))
    },
    onResolve: () => {
      this.flushUnmatchedTextToNakedUrl()
    },
    onClose: () => {
      // There could be some bracket contexts opened inside the URL, and we don't want them to have any impact on
      // any text that follows the URL.
      this.closeMostRecentContextWithStateAndAnyInnerContexts(TokenizerState.NakedUrl)
    }
  }


  constructor(private entireText: string, config: UpConfig) {
    this.configureConventions(config)
    this.dirty()
    this.tokenize()
    this.tokens = nestOverlappingConventions(applyRaisedVoices(this.tokens))
  }

  private tokenize(): void {
    while (!(this.reachedEndOfText() && this.resolveOpenContexts())) {

      this.collectCurrentCharIfEscaped()
        || this.handleInlineCode()
        || this.performContextSpecificTokenizations()

        || (this.hasState(TokenizerState.NakedUrl) && (
          this.openParenthesisInsideUrl()
          || this.openSquareBracketInsideUrl()
          || this.bufferCurrentChar()))

        || (this.hasState(TokenizerState.SquareBracketed)
          && this.convertSquareBracketedContextToLink())

        || this.tokenizeRaisedVoicePlaceholders()
        || this.openSandwich(this.inlineCodeConvention)
        || this.openSandwich(this.spoilerConvention)
        || this.openSandwich(this.footnoteConvention)
        || this.openSandwich(this.revisionDeletionConvention)
        || this.openSandwich(this.revisionInsertionConvention)
        || this.openMedia()
        || this.openSandwich(this.parenthesizedConvention)
        || this.openSandwich(this.squareBracketedConvention)
        || this.openNakedUrl()

        || this.bufferCurrentChar()
    }
  }

  private performSpecificTokenizations(state: TokenizerState): boolean {
    return (
      this.closeSandwichCorrespondingToState(state)
      || this.handleMediaCorrespondingToState(state)

      || ((state === TokenizerState.LinkUrl) && (
        this.openSquareBracketInsideUrl()
        || this.closeLink()
        || this.bufferCurrentChar()))

      || ((state === TokenizerState.MediaUrl) && (
        this.openSquareBracketInsideUrl()
        || this.closeMedia()
        || this.bufferCurrentChar()))

      || ((state === TokenizerState.NakedUrl) && this.tryCloseNakedUrl())
    )
  }

  private closeSandwichCorrespondingToState(state: TokenizerState): boolean {
    return [
      this.spoilerConvention,
      this.footnoteConvention,
      this.revisionDeletionConvention,
      this.revisionInsertionConvention,
      this.squareBracketedConvention,
      this.parenthesizedConvention,
      this.squareBracketedInsideUrlConvention,
      this.parenthesizedInsideUrlConvention
    ].some(sandwich =>
      (sandwich.state === state)
      && this.closeSandwich(sandwich))
  }

  private handleMediaCorrespondingToState(state: TokenizerState): boolean {
    return this.mediaConventions.some(media =>
      (media.state === state)
      && (this.openMediaUrl() || this.bufferCurrentChar()))
  }

  private handleInlineCode(): boolean {
    const currentOpenContext = last(this.openContexts)

    return (
      currentOpenContext
      && (currentOpenContext.state === TokenizerState.InlineCode)
      && (this.closeSandwich(this.inlineCodeConvention) || this.bufferCurrentChar())
    )
  }

  private performContextSpecificTokenizations(): boolean {
    for (let i = this.openContexts.length - 1; i >= 0; i--) {
      if (this.performSpecificTokenizations(this.openContexts[i].state)) {
        return true
      }
    }

    return false
  }

  private openParenthesisInsideUrl(): boolean {
    return this.openSandwich(this.parenthesizedInsideUrlConvention)
  }

  private openSquareBracketInsideUrl(): boolean {
    return this.openSandwich(this.squareBracketedInsideUrlConvention)
  }

  private collectCurrentCharIfEscaped(): boolean {
    const ESCAPE_CHAR = '\\'

    if (this.currentChar !== ESCAPE_CHAR) {
      return false
    }

    this.advance(1)

    return (
      this.reachedEndOfText()
      || this.bufferCurrentChar()
    )
  }

  private addToken(token: Token): void {
    this.currentToken = token
    this.tokens.push(token)
  }

  private reachedEndOfText(): boolean {
    return !this.remainingText
  }

  private resolveOpenContexts(): boolean {
    while (this.openContexts.length) {
      const context = this.openContexts.pop()

      switch (context.state) {
        case TokenizerState.NakedUrl:
          this.flushUnmatchedTextToNakedUrl()
          break;

        // Parentheses and brackets can be left unclosed.
        case TokenizerState.SquareBracketed:
        case TokenizerState.Parenthesized:
        case TokenizerState.SquareBracketedInsideUrl:
        case TokenizerState.ParenthesizedInsideUrl:
        // If a link URL is unclosed, that means the link itself is unclosed, too. We'll let the default
        // handler (below) backtrack to before the link itself.
        case TokenizerState.LinkUrl:
        // The same applies for media URLs.
        case TokenizerState.MediaUrl:
          break;

        default:
          this.failContextAndResetToBeforeIt(context)
          return false
      }
    }

    this.flushBufferToPlainTextToken()

    return true
  }

  private failContextAndResetToBeforeIt(context: TokenizerContext): void {
    this.failedStateTracker.registerFailure(context)

    this.textIndex = context.textIndex
    this.tokens.splice(context.countTokens)
    this.openContexts = context.openContexts
    this.bufferedText = context.plainTextBuffer

    this.currentToken = last(this.tokens)
    this.dirty()
  }

  private advance(length: number): void {
    this.textIndex += length
    this.dirty()
  }

  // This method will never fail, and it always returns true.
  //
  // Ensuring it always returns true allows us to use some cleaner boolean logic. 
  private bufferCurrentChar(): boolean {
    this.bufferedText += this.currentChar
    this.advance(1)

    return true
  }

  private flushBufferedText(): string {
    const bufferedText = this.bufferedText
    this.bufferedText = ''

    return bufferedText
  }

  private flushBufferToPlainTextToken(): void {
    // This will create a PlainTextToken even when there isn't any text to flush.
    //
    // TODO: Explain why this is helpful
    this.addToken(new PlainTextToken(this.flushBufferedText()))
  }

  private canTry(state: TokenizerState, textIndex = this.textIndex): boolean {
    return !this.failedStateTracker.hasFailed(state, textIndex)
  }

  private openNakedUrl(): boolean {
    return !this.hasState(TokenizerState.Link) && this.openConvention({
      state: TokenizerState.NakedUrl,
      pattern: NAKED_URL_START_PATTERN,
      then: (urlProtocol) => {
        this.addTokenAfterFlushingBufferToPlainTextToken(new NakedUrlToken(urlProtocol))
      }
    })
  }

  private tryCloseNakedUrl(): boolean {
    // Whitespace terminates naked URLs, but we don't actually advance past the whitespace character! We leave
    // the whitespace to be matched by another convention (e.g. the leading space for footnote reference).
    if (!WHITESPACE_CHAR_PATTERN.test(this.currentChar)) {
      return false
    }

    this.flushUnmatchedTextToNakedUrl()

    // There could be some bracket contexts opened inside the naked URL, and we don't want them to have any impact on
    // any text that follows the URL.
    this.closeMostRecentContextWithStateAndAnyInnerContexts(TokenizerState.NakedUrl)

    return true
  }

  private flushUnmatchedTextToNakedUrl(): void {
    (<NakedUrlToken>this.currentToken).restOfUrl = this.flushBufferedText()
  }

  private openMedia(): boolean {
    for (let media of this.mediaConventions) {
      const openedMediaConvention = this.openConvention({
        state: media.state,
        pattern: media.startPattern,
        then: () => {
          this.addTokenAfterFlushingBufferToPlainTextToken(new media.TokenType())
        }
      })

      if (openedMediaConvention) {
        return true
      }
    }

    return false
  }

  private convertSquareBracketedContextToLink(): boolean {
    const didStartLinkUrl =
      this.openConvention({
        state: TokenizerState.LinkUrl,
        pattern: LINK_AND_MEDIA_URL_ARROW_PATTERN,
        then: (arrow) => this.flushBufferToPlainTextToken()
      })

    if (!didStartLinkUrl) {
      return false
    }

    const squareBrackeContext =
      this.getInnermostContextWithState(TokenizerState.SquareBracketed)

    if (!this.canTry(TokenizerState.Link, squareBrackeContext.textIndex)) {
      // If we can't try a link at that location, it means we've already tried, and we failed to find the
      // closing bracket.

      // First, lets get rid of the new link URL context.
      const linkUrlContext = this.openContexts.pop()

      // Next, let's fail it, so we don't try match the URL arrow again.
      this.failContextAndResetToBeforeIt(linkUrlContext)

      return false
    }

    squareBrackeContext.state = TokenizerState.Link

    // The token at `countTokens` is the flushed PlainTextToken. The next one is the SquareBracketedStartToken
    // we want to replace with a LinkStartToken.
    const indexOfSquareBracketedStartToken =
      squareBrackeContext.countTokens + 1

    this.tokens.splice(indexOfSquareBracketedStartToken, 1, new LINK.StartTokenType())

    return true
  }

  private openMediaUrl(): boolean {
    return this.openConvention({
      state: TokenizerState.MediaUrl,
      pattern: LINK_AND_MEDIA_URL_ARROW_PATTERN,
      then: () => {
        (<MediaToken>this.currentToken).description = this.flushBufferedText()
      }
    })
  }

  private closeLink(): boolean {
    return this.advanceAfterMatch({
      pattern: LINK_END_PATTERN,
      then: () => {
        const url = this.flushBufferedText()
        this.addToken(new LINK.EndTokenType(url))
        this.closeMostRecentContextWithState(TokenizerState.LinkUrl)
        this.closeMostRecentContextWithState(TokenizerState.Link)
      }
    })
  }

  private closeMedia(): boolean {
    return this.advanceAfterMatch({
      pattern: LINK_END_PATTERN,
      then: () => {
        (<MediaToken>this.currentToken).url = this.flushBufferedText()
        this.closeMostRecentContextWithState(TokenizerState.MediaUrl)

        // Once the media URL's context is closed, the media's context is guaranteed to be innermost.
        this.closeInnermostContext()
      }
    })
  }

  private openSandwich(sandwich: TokenizableSandwich): boolean {
    return this.openConvention({
      state: sandwich.state,
      pattern: sandwich.startPattern,
      then: sandwich.onOpen
    })
  }

  private closeSandwich(sandwich: TokenizableSandwich): boolean {
    return this.advanceAfterMatch({
      pattern: sandwich.endPattern,
      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        this.closeMostRecentContextWithState(sandwich.state)
        sandwich.onClose(match, isTouchingWordEnd, isTouchingWordStart, ...captures)
      }
    })
  }

  private openConvention(
    args: {
      state: TokenizerState,
      pattern: RegExp,
      then: OnTokenizerMatch
    }
  ): boolean {
    const { state, pattern, then } = args

    return this.canTry(state) && this.advanceAfterMatch({
      pattern: pattern,

      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        this.openContexts.push({
          state,
          textIndex: this.textIndex,
          countTokens: this.tokens.length,
          openContexts: this.openContexts.slice(),
          plainTextBuffer: this.bufferedText
        })

        then(match, isTouchingWordEnd, isTouchingWordStart, ...captures)
      }
    })
  }

  private closeMostRecentContextWithState(state: TokenizerState): void {
    let indexOfEnclosedNakedUrlContext = -1

    for (let i = this.openContexts.length - 1; i >= 0; i--) {
      const context = this.openContexts[i]

      if (context.state === state) {
        // As a rule, if a convention enclosing a naked URL is closed, the naked URL gets closed, too.
        if (indexOfEnclosedNakedUrlContext != -1) {
          this.flushUnmatchedTextToNakedUrl()
          this.openContexts.splice(indexOfEnclosedNakedUrlContext, 1)
        }

        this.openContexts.splice(i, 1)
        return
      }

      if (context.state === TokenizerState.NakedUrl) {
        indexOfEnclosedNakedUrlContext = i
      }
    }

    throw new Error(`State was not open: ${TokenizerState[state]}`)
  }

  private closeMostRecentContextWithStateAndAnyInnerContexts(state: TokenizerState): void {
    while (this.openContexts.length) {
      const context = this.openContexts.pop()

      if (context.state === state) {
        return
      }
    }

    throw new Error(`State was not open: ${TokenizerState[state]}`)
  }

  private getInnermostContextWithState(state: TokenizerState): TokenizerContext {
    for (let i = this.openContexts.length - 1; i >= 0; i--) {
      const context = this.openContexts[i]

      if (context.state === state) {
        return context
      }
    }

    throw new Error(`State was not open: ${TokenizerState[state]}`)
  }

  private closeInnermostContext(): void {
    if (!this.openContexts.length) {
      throw new Error(`No open contexts`)
    }

    this.openContexts.pop()
  }

  private addTokenAfterFlushingBufferToPlainTextToken(token: Token): void {
    this.flushBufferToPlainTextToken()
    this.addToken(token)
  }

  private hasState(state: TokenizerState): boolean {
    return this.openContexts.some(context => context.state === state)
  }

  private advanceAfterMatch(args: { pattern: RegExp, then?: OnTokenizerMatch }): boolean {
    const { pattern, then } = args

    const result = pattern.exec(this.remainingText)

    if (!result) {
      return false
    }

    const [match, ...captures] = result

    const charAfterMatch = this.entireText[this.textIndex + match.length]
    const isTouchingWordStart = NON_WHITESPACE_CHAR_PATTERN.test(charAfterMatch)

    if (then) {
      then(match, this.isTouchingWordEnd, isTouchingWordStart, ...captures)
    }

    this.advance(match.length)

    return true
  }

  private dirty(): void {
    this.remainingText = this.entireText.substr(this.textIndex)
    this.currentChar = this.remainingText[0]

    const previousChar = this.entireText[this.textIndex - 1]
    this.isTouchingWordEnd = NON_WHITESPACE_CHAR_PATTERN.test(previousChar)
  }

  private getRichSandwichBehavior(convention: RichConvention): TokenizerContextBehavior {
    return {
      mustClose: true,
      onOpen: () => this.addTokenAfterFlushingBufferToPlainTextToken(new convention.StartTokenType()),
      onClose: () => this.addTokenAfterFlushingBufferToPlainTextToken(new convention.EndTokenType())
    }
  }

  private getBracketInsideUrlBehavior(): TokenizerContextBehavior {
    const bufferBracket = (bracket: string) => {
      this.bufferedText += bracket
    }

    return {
      mustClose: false,
      onOpen: bufferBracket,
      onClose: bufferBracket
    }
  }

  private getMediaBehavior(media: MediaConvention): TokenizerContextBehavior {
    return {
      mustClose: true,
      onOpen: () => this.addTokenAfterFlushingBufferToPlainTextToken(new media.TokenType())
    }
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
      state: richConvention.tokenizerState,
      startPattern,
      endPattern,
      onOpen: () => this.addTokenAfterFlushingBufferToPlainTextToken(new richConvention.StartTokenType()),
      onClose: () => this.addTokenAfterFlushingBufferToPlainTextToken(new richConvention.EndTokenType())
    })
  }

  private getBracketInsideUrlConvention(
    args: {
      state: TokenizerState,
      openBracketPattern: string,
      closeBracketPattern: string
    }
  ): TokenizableSandwich {
    const bufferBracket = (bracket: string) => {
      this.bufferedText += bracket
    }

    return new TokenizableSandwich({
      state: args.state,
      startPattern: args.openBracketPattern,
      endPattern: args.closeBracketPattern,
      onOpen: bufferBracket,
      onClose: bufferBracket
    })
  }

  private tokenizeRaisedVoicePlaceholders(): boolean {
    return this.advanceAfterMatch({
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

        let AsteriskTokenType: new (asterisks: string) => Token

        if (canOpenConvention && canCloseConvention) {
          AsteriskTokenType = PotentialRaisedVoiceStartOrEndToken
        } else if (canOpenConvention) {
          AsteriskTokenType = PotentialRaisedVoiceStartToken
        } else if (canCloseConvention) {
          AsteriskTokenType = PotentialRaisedVoiceEndToken
        } else {
          AsteriskTokenType = PlainTextToken
        }

        this.addTokenAfterFlushingBufferToPlainTextToken(new AsteriskTokenType(asterisks))
      }
    })
  }

  private configureConventions(config: UpConfig): void {
    this.mediaConventions =
      [AUDIO, IMAGE, VIDEO]
        .map(media =>
          new TokenizableMedia(media, config.localizeTerm(media.nonLocalizedTerm)))

    this.footnoteConvention =
      this.getRichSandwich({
        richConvention: FOOTNOTE,
        startPattern: ANY_WHITESPACE + escapeForRegex('(('),
        endPattern: escapeForRegex('))')
      })

    this.spoilerConvention =
      this.getRichSandwich({
        richConvention: SPOILER,
        startPattern: OPEN_SQUARE_BRACKET + escapeForRegex(config.settings.i18n.terms.spoiler) + ':' + ANY_WHITESPACE,
        endPattern: CLOSE_SQUARE_BRACKET
      })

    this.revisionDeletionConvention =
      this.getRichSandwich({
        richConvention: REVISION_DELETION,
        startPattern: '~~',
        endPattern: '~~'
      })

    this.revisionInsertionConvention =
      this.getRichSandwich({
        richConvention: REVISION_INSERTION,
        startPattern: escapeForRegex('++'),
        endPattern: escapeForRegex('++')
      })

    this.parenthesizedConvention =
      this.getRichSandwich({
        richConvention: PARENTHESIZED,
        startPattern: OPEN_PAREN,
        endPattern: CLOSE_PAREN,
      })

    this.squareBracketedConvention =
      this.getRichSandwich({
        richConvention: SQUARE_BRACKETED,
        startPattern: OPEN_SQUARE_BRACKET,
        endPattern: CLOSE_SQUARE_BRACKET,
      })

    this.parenthesizedInsideUrlConvention =
      this.getBracketInsideUrlConvention({
        state: TokenizerState.ParenthesizedInsideUrl,
        openBracketPattern: OPEN_PAREN,
        closeBracketPattern: CLOSE_PAREN
      })

    this.squareBracketedInsideUrlConvention =
      this.getBracketInsideUrlConvention({
        state: TokenizerState.SquareBracketedInsideUrl,
        openBracketPattern: OPEN_SQUARE_BRACKET,
        closeBracketPattern: CLOSE_SQUARE_BRACKET
      })

    this.inlineCodeConvention =
      new TokenizableSandwich({
        state: TokenizerState.InlineCode,
        startPattern: '`',
        endPattern: '`',
        onOpen: () => this.flushBufferToPlainTextToken(),
        onClose: () => this.addToken(new InlineCodeToken(this.flushBufferedText()))
      })
  }
}


const RAISED_VOICE_DELIMITER_PATTERN = new RegExp(
  startsWith(atLeast(1, escapeForRegex('*'))))

const LINK_START_PATTERN = new RegExp(
  startsWith(OPEN_SQUARE_BRACKET))

const LINK_AND_MEDIA_URL_ARROW_PATTERN = new RegExp(
  startsWith(ANY_WHITESPACE + '->' + ANY_WHITESPACE))

const LINK_END_PATTERN = new RegExp(
  startsWith(CLOSE_SQUARE_BRACKET))

const NAKED_URL_START_PATTERN = new RegExp(
  startsWith('http' + optional('s') + '://'))

const WHITESPACE_CHAR_PATTERN = new RegExp(
  WHITESPACE_CHAR)

const NON_WHITESPACE_CHAR_PATTERN = new RegExp(
  NON_WHITESPACE_CHAR)
