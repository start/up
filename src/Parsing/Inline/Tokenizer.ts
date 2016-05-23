import { escapeForRegex, startsWith, optional, atLeast, ANY_WHITESPACE, WHITESPACE_CHAR, NON_WHITESPACE_CHAR, OPEN_PAREN, CLOSE_PAREN, OPEN_SQUARE_BRACKET, CLOSE_SQUARE_BRACKET, OPEN_CURLY_BRACKET, CLOSE_CURLY_BRACKET } from '../Patterns'
import { REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE, LINK, PARENTHESIZED, SQUARE_BRACKETED, CURLY_BRACKETED } from './RichConventions'
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


export class Tokenizer {
  tokens: Token[] = []

  private textIndex = 0

  // These three fields are computed every time we updatae `textIndex`.
  private currentChar: string
  private remainingText: string
  private isTouchingWordEnd: boolean

  // This field is updated every time we add a new token.
  private currentToken: Token

  // Any time we open a new convention, we add it to `openContexts`.
  //
  // Most conventions need to be closed by the time we consume the last character of the text.
  private openContexts: TokenizerContext[] = []

  private failedStateTracker: FailedStateTracker = new FailedStateTracker()

  // The this buffer is for any text that isn't consumed by special delimiters. Eventually, the buffer gets
  // flushed to a token, asually a PlainTextToken.
  private bufferedText = ''

  private inlineCodeConvention: TokenizableSandwich
  private footnoteConvention: TokenizableSandwich
  private spoilerConvention: TokenizableSandwich
  private revisionDeletionConvention: TokenizableSandwich
  private revisionInsertionConvention: TokenizableSandwich

  private parenthesizedConvention: TokenizableSandwich
  private squareBracketedConvention: TokenizableSandwich
  private curlyBracketedConvention: TokenizableSandwich

  // Unlike the other bracket conventions, these don't produce special tokens
  private parenthesizedRawTextConvention: TokenizableSandwich
  private squareBracketedRawTextConvention: TokenizableSandwich
  private curlyBracketedRawTextConvention: TokenizableSandwich

  private allSandwiches: TokenizableSandwich[]
  private sandwichesThatCanAppearInRegularContent: TokenizableSandwich[]

  // These conventions are for images, audio, and video
  private mediaConventions: TokenizableMedia[]

  constructor(private entireText: string, config: UpConfig) {
    this.configureConventions(config)
    this.dirty()
    this.tokenize()

    this.tokens =
      nestOverlappingConventions(
        applyRaisedVoices(
          this.addPlainTextBrackets()))
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

    this.curlyBracketedConvention =
      this.getRichSandwich({
        richConvention: CURLY_BRACKETED,
        startPattern: OPEN_CURLY_BRACKET,
        endPattern: CLOSE_CURLY_BRACKET,
      })

    this.parenthesizedRawTextConvention =
      this.getBracketInsideUrlConvention({
        state: TokenizerState.ParenthesizedInRawText,
        openBracketPattern: OPEN_PAREN,
        closeBracketPattern: CLOSE_PAREN
      })

    this.squareBracketedRawTextConvention =
      this.getBracketInsideUrlConvention({
        state: TokenizerState.SquareBracketedInRawText,
        openBracketPattern: OPEN_SQUARE_BRACKET,
        closeBracketPattern: CLOSE_SQUARE_BRACKET
      })

    this.curlyBracketedRawTextConvention =
      this.getBracketInsideUrlConvention({
        state: TokenizerState.CurlyBracketedInRawText,
        openBracketPattern: OPEN_CURLY_BRACKET,
        closeBracketPattern: CLOSE_CURLY_BRACKET
      })

    this.inlineCodeConvention =
      new TokenizableSandwich({
        state: TokenizerState.InlineCode,
        startPattern: '`',
        endPattern: '`',
        onOpen: () => this.flushBufferToPlainTextToken(),
        onClose: () => this.addToken(new InlineCodeToken(this.flushBufferedText()))
      })

    this.allSandwiches = [
      this.spoilerConvention,
      this.footnoteConvention,
      this.revisionDeletionConvention,
      this.revisionInsertionConvention,
      this.inlineCodeConvention,
      this.squareBracketedConvention,
      this.curlyBracketedConvention,
      this.parenthesizedConvention,
      this.squareBracketedRawTextConvention,
      this.parenthesizedRawTextConvention,
      this.curlyBracketedRawTextConvention
    ]

    this.sandwichesThatCanAppearInRegularContent = [
      this.inlineCodeConvention,
      this.spoilerConvention,
      this.footnoteConvention,
      this.revisionDeletionConvention,
      this.revisionInsertionConvention,
      this.parenthesizedConvention,
      this.squareBracketedConvention,
      this.curlyBracketedConvention
    ]
  }

  private tokenize(): void {
    while (!(this.reachedEndOfText() && this.resolveOpenContexts())) {

      this.tryCollectCurrentCharIfEscaped()
        || this.tryCloseOrAdvanceOpenContexts()
        || (this.hasState(TokenizerState.NakedUrl) && this.handleNakedUrl())
        || (this.hasState(TokenizerState.SquareBracketed) && this.tryConvertSquareBracketedContextToLink())
        || this.tryTokenizeRaisedVoicePlaceholders()
        || this.tryOpenMedia()
        || this.tryOpenAnySandwichThatCanAppearInRegularContent()
        || this.tryOpenNakedUrl()
        || this.bufferCurrentChar()
    }
  }

  private tryOpenAnySandwichThatCanAppearInRegularContent(): boolean {
    return this.sandwichesThatCanAppearInRegularContent
      .some(sandwich => this.tryOpenSandwich(sandwich))
  }

  private tryCloseOrAdvanceOpenContexts(): boolean {
    for (let i = this.openContexts.length - 1; i >= 0; i--) {
      if (this.tryCloseOrAdvanceContext(this.openContexts[i])) {
        return true
      }
    }

    return false
  }

  private handleNakedUrl(): boolean {
    return (
      this.tryOpenParenthesizedRawText()
      || this.tryOpenSquareBracketedRawText()
      || this.tryOpenCurlyBracketedRawText()
      || this.tryCloseNakedUrl()
      || this.bufferCurrentChar())
  }

  private tryCloseOrAdvanceContext(context: TokenizerContext): boolean {
    const { state } = context

    return (
      this.tryCloseSandwichCorrespondingToState(state)
      || this.handleMediaCorrespondingToState(state)
      || ((state === TokenizerState.InlineCode) && this.bufferCurrentChar())
      || ((state === TokenizerState.LinkUrl) && this.closeLinkOrAppendCharToUrl())
      || ((state === TokenizerState.MediaUrl) && this.closeMediaOrAppendCharToUrl())
    )
  }

  private closeLinkOrAppendCharToUrl(): boolean {
    return (
      this.tryOpenSquareBracketedRawText()
      || this.tryCloseLink()
      || this.bufferCurrentChar())
  }

  private closeMediaOrAppendCharToUrl(): boolean {
    return (
      this.tryOpenSquareBracketedRawText()
      || this.tryCloseMedia()
      || this.bufferCurrentChar())
  }

  private tryCloseSandwichCorrespondingToState(state: TokenizerState): boolean {
    return this.allSandwiches.some(sandwich => (sandwich.state === state) && this.tryCloseSandwich(sandwich))
  }

  private handleMediaCorrespondingToState(state: TokenizerState): boolean {
    return this.mediaConventions
      .some(media =>
        (media.state === state)
        && (
          this.tryOpenMediaUrl()
          || this.tryOpenSquareBracketedRawText()
          || this.tryCloseFalseMediaConvention(state)
          || this.bufferCurrentChar()))
  }

  private tryCloseFalseMediaConvention(mediaState: TokenizerState): boolean {
    if (!CLOSE_SQUARE_BRACKET_PATTERN.test(this.remainingText)) {
      return false
    }

    // If we've encounter a closing square bracket here, it means it's unmatched. If it were matched, it would have
    // been consumed by a SquareBracketedInRawText context.
    //
    // Anyway, we're dealing with something like this: [audio: garbled]
    //
    // That is not a valid media convention, so we need to backtrack!

    this.failMostRecentContextWithStateAndResetToBeforeIt(mediaState)
    return true
  }

  private tryOpenParenthesizedRawText(): boolean {
    return this.tryOpenSandwich(this.parenthesizedRawTextConvention)
  }

  private tryOpenSquareBracketedRawText(): boolean {
    return this.tryOpenSandwich(this.squareBracketedRawTextConvention)
  }

  private tryOpenCurlyBracketedRawText(): boolean {
    return this.tryOpenSandwich(this.curlyBracketedRawTextConvention)
  }

  private tryCollectCurrentCharIfEscaped(): boolean {
    const ESCAPE_CHAR = '\\'

    if (this.currentChar !== ESCAPE_CHAR) {
      return false
    }

    this.advanceTextIndex(1)

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
        case TokenizerState.SquareBracketedInRawText:
        case TokenizerState.ParenthesizedInRawText:
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

  private advanceTextIndex(length: number): void {
    this.textIndex += length
    this.dirty()
  }

  // This method always returns true, which allows us to use some cleaner boolean logic.
  private bufferCurrentChar(): boolean {
    this.bufferedText += this.currentChar
    this.advanceTextIndex(1)

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

  private tryOpenNakedUrl(): boolean {
    return this.tryOpenConvention({
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

    this.finalizeNakedUrl()
    return true
  }
  
  private finalizeNakedUrl(): void {
    this.flushUnmatchedTextToNakedUrl()
    
    if (!this.currentNakedUrlToken().restOfUrl) {
      // As a rule, naked URLs consisting only of a protocol are treated as plain text. We don't need to backtrack,
      // because the protocol can't possibly be interpreted as another convention.
      this.failMostRecentContextWithStateAndResetToBeforeIt(TokenizerState.NakedUrl)
    }

    // There could be some bracket contexts opened inside the naked URL, and we don't want them to have any impact on
    // any text that follows the URL.
    this.closeMostRecentContextWithStateAndAnyInnerContexts(TokenizerState.NakedUrl)
  }

  private flushUnmatchedTextToNakedUrl(): void {
    this.currentNakedUrlToken().restOfUrl = this.flushBufferedText()
  }
  
  private currentNakedUrlToken(): NakedUrlToken {
    return (<NakedUrlToken>this.currentToken)
  }

  private tryOpenMedia(): boolean {
    return this.mediaConventions.some(media => {
      return this.tryOpenConvention({
        state: media.state,
        pattern: media.startPattern,
        then: () => {
          this.addTokenAfterFlushingBufferToPlainTextToken(new media.TokenType())
        }
      })
    })
  }

  private tryConvertSquareBracketedContextToLink(): boolean {
    const didStartLinkUrl =
      this.tryOpenConvention({
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
      // If we can't try a link at that location, it means we've already tried and failed to find the closing
      // bracket.

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

  private tryOpenMediaUrl(): boolean {
    return this.tryOpenConvention({
      state: TokenizerState.MediaUrl,
      pattern: LINK_AND_MEDIA_URL_ARROW_PATTERN,
      then: () => {
        (<MediaToken>this.currentToken).description = this.flushBufferedText()
      }
    })
  }

  private tryCloseLink(): boolean {
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

  private tryCloseMedia(): boolean {
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

  private tryOpenSandwich(sandwich: TokenizableSandwich): boolean {
    return this.tryOpenConvention({
      state: sandwich.state,
      pattern: sandwich.startPattern,
      then: sandwich.onOpen
    })
  }

  private tryCloseSandwich(sandwich: TokenizableSandwich): boolean {
    return this.advanceAfterMatch({
      pattern: sandwich.endPattern,
      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        this.closeMostRecentContextWithState(sandwich.state)
        sandwich.onClose(match, isTouchingWordEnd, isTouchingWordStart, ...captures)
      }
    })
  }

  private tryOpenConvention(
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

  private failMostRecentContextWithStateAndResetToBeforeIt(state: TokenizerState): void {
    while (this.openContexts.length) {
      const context = this.openContexts.pop()

      if (context.state === state) {
        this.failContextAndResetToBeforeIt(context)
        return
      }
    }

    throw new Error(`State was not open: ${TokenizerState[state]}`)
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

    this.advanceTextIndex(match.length)

    return true
  }

  private dirty(): void {
    this.remainingText = this.entireText.substr(this.textIndex)
    this.currentChar = this.remainingText[0]

    const previousChar = this.entireText[this.textIndex - 1]
    this.isTouchingWordEnd = NON_WHITESPACE_CHAR_PATTERN.test(previousChar)
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

  private tryTokenizeRaisedVoicePlaceholders(): boolean {
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

  private addPlainTextBrackets(): Token[] {
    const resultTokens: Token[] = []

    for (const token of this.tokens) {
      function addBracketIfTokenIs(bracket: string, TokenType: TokenType): void {
        if (token instanceof TokenType) {
          resultTokens.push(new PlainTextToken(bracket))
        }
      }

      addBracketIfTokenIs(')', PARENTHESIZED.EndTokenType)
      addBracketIfTokenIs(']', SQUARE_BRACKETED.EndTokenType)
      addBracketIfTokenIs('}', CURLY_BRACKETED.EndTokenType)

      resultTokens.push(token)

      addBracketIfTokenIs('(', PARENTHESIZED.StartTokenType)
      addBracketIfTokenIs('[', SQUARE_BRACKETED.StartTokenType)
      addBracketIfTokenIs('{', CURLY_BRACKETED.StartTokenType)
    }

    return resultTokens
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

const CLOSE_SQUARE_BRACKET_PATTERN = new RegExp(
  startsWith(CLOSE_SQUARE_BRACKET)
)