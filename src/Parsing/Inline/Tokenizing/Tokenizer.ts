import { escapeForRegex, startsWith, optional, atLeast, ANY_WHITESPACE, WHITESPACE_CHAR, NON_WHITESPACE_CHAR, OPEN_PAREN, CLOSE_PAREN, OPEN_SQUARE_BRACKET, CLOSE_SQUARE_BRACKET, OPEN_CURLY_BRACKET, CLOSE_CURLY_BRACKET } from '../../../Patterns'
import { REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE, LINK, PARENTHESIZED, SQUARE_BRACKETED, ACTION } from './RichConventions'
import { AUDIO, IMAGE, VIDEO } from './MediaConventions'
import { UpConfig } from '../../../UpConfig'
import { RichConvention } from './RichConvention'
import { MediaConvention } from './MediaConvention'
import { applyRaisedVoices }  from './RaisedVoices/applyRaisedVoices'
import { nestOverlappingConventions } from './nestOverlappingConventions'
import { OnTokenizerMatch } from './OnTokenizerMatch'
import { last } from '../../../CollectionHelpers'
import { MediaDescriptionToken } from './Tokens/MediaDescriptionToken'
import { MediaEndToken } from './Tokens/MediaEndToken'
import { TokenizerGoal } from './TokenizerGoal'
import { TokenizableSandwich } from './TokenizableSandwich'
import { TokenizableMedia } from './TokenizableMedia'
import { FailedGoalTracker } from './FailedGoalTracker'
import { TokenizerContext } from './TokenizerContext'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { Token } from './Tokens/Token'
import { TokenType } from './Tokens/TokenType'
import { InlineCodeToken } from './Tokens/InlineCodeToken'
import { PlainTextToken } from './Tokens/PlainTextToken'
import { NakedUrlStartToken } from './Tokens/NakedUrlStartToken'
import { NakedUrlEndToken } from './Tokens/NakedUrlEndToken'
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

  // Any time we open a new convention, we add it to `openContexts`.
  //
  // Most conventions need to be closed by the time we consume the last character of the text.
  private openContexts: TokenizerContext[] = []

  private failedGoalTracker: FailedGoalTracker = new FailedGoalTracker()

  // The this buffer is for any text that isn't consumed by special delimiters. Eventually, the buffer gets
  // flushed to a token, asually a PlainTextToken.
  private bufferedText = ''

  private inlineCodeConvention: TokenizableSandwich
  private footnoteConvention: TokenizableSandwich
  private spoilerConvention: TokenizableSandwich
  private revisionDeletionConvention: TokenizableSandwich
  private revisionInsertionConvention: TokenizableSandwich
  private actionConvention: TokenizableSandwich

  private parenthesizedConvention: TokenizableSandwich
  private squareBracketedConvention: TokenizableSandwich

  // Unlike the other bracket conventions, these don't produce special tokens. They can only appear inside URLs
  // or media conventions' descriptions.  
  private parenthesizedRawTextConvention: TokenizableSandwich
  private squareBracketedRawTextConvention: TokenizableSandwich
  private curlyBracketedRawTextConvention: TokenizableSandwich

  // This collection includes every sandwich except for the "raw" bracket conventions above.
  private sandwichesThatCanAppearInRegularContent: TokenizableSandwich[]

  // This collection includes every sandwich.
  private allSandwiches: TokenizableSandwich[]

  // These conventions are for images, audio, and video
  private mediaConventions: TokenizableMedia[]

  constructor(private entireText: string, config: UpConfig) {
    this.configureConventions(config)
    this.updateComputedTextFields()
    this.tokenize()
  }

  private configureConventions(config: UpConfig): void {
    this.mediaConventions =
      [AUDIO, IMAGE, VIDEO].map(media =>
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

    this.actionConvention =
      this.getRichSandwich({
        richConvention: ACTION,
        startPattern: OPEN_CURLY_BRACKET,
        endPattern: CLOSE_CURLY_BRACKET,
      })

    this.parenthesizedRawTextConvention =
      this.getBracketInsideUrlConvention({
        goal: TokenizerGoal.ParenthesizedInRawText,
        openBracketPattern: OPEN_PAREN,
        closeBracketPattern: CLOSE_PAREN
      })

    this.squareBracketedRawTextConvention =
      this.getBracketInsideUrlConvention({
        goal: TokenizerGoal.SquareBracketedInRawText,
        openBracketPattern: OPEN_SQUARE_BRACKET,
        closeBracketPattern: CLOSE_SQUARE_BRACKET
      })

    this.curlyBracketedRawTextConvention =
      this.getBracketInsideUrlConvention({
        goal: TokenizerGoal.CurlyBracketedInRawText,
        openBracketPattern: OPEN_CURLY_BRACKET,
        closeBracketPattern: CLOSE_CURLY_BRACKET
      })

    this.inlineCodeConvention =
      new TokenizableSandwich({
        goal: TokenizerGoal.InlineCode,
        startPattern: '`',
        endPattern: '`',
        onOpen: () => this.flushBufferToPlainTextToken(),
        onClose: () => this.addToken(new InlineCodeToken(this.flushBufferedText()))
      })

    this.sandwichesThatCanAppearInRegularContent = [
      this.inlineCodeConvention,
      this.spoilerConvention,
      this.footnoteConvention,
      this.revisionDeletionConvention,
      this.revisionInsertionConvention,
      this.actionConvention,
      this.parenthesizedConvention,
      this.squareBracketedConvention
    ]

    this.allSandwiches = this.sandwichesThatCanAppearInRegularContent.concat([
      this.squareBracketedRawTextConvention,
      this.parenthesizedRawTextConvention,
      this.curlyBracketedRawTextConvention
    ])
  }

  private tokenize(): void {
    while (!(this.reachedEndOfText() && this.resolveOpenContexts())) {
      this.tryToCollectCurrentCharIfEscaped()
        || this.tryToCloseOrAdvanceOpenContexts()
        || (this.hasGoal(TokenizerGoal.NakedUrl) && this.handleNakedUrl())
        || this.tryToTokenizeRaisedVoicePlaceholders()
        || this.tryToOpenMedia()
        || this.tryToOpenAnySandwichThatCanAppearInRegularContent()
        || this.tryToOpenNakedUrl()
        || this.bufferCurrentChar()
    }

    this.tokens =
      nestOverlappingConventions(
        applyRaisedVoices(
          this.addPlainTextBrackets()))
  }

  private tryToCloseOrAdvanceOpenContexts(): boolean {
    for (let i = this.openContexts.length - 1; i >= 0; i--) {
      if (this.tryToCloseOrAdvanceContext(this.openContexts[i])) {
        return true
      }
    }

    return false
  }

  private handleNakedUrl(): boolean {
    return (
      this.tryToOpenParenthesizedRawText()
      || this.tryToOpenSquareBracketedRawText()
      || this.tryToOpenCurlyBracketedRawText()
      || this.tryToCloseNakedUrl()
      || this.bufferCurrentChar())
  }

  private tryToCloseOrAdvanceContext(context: TokenizerContext): boolean {
    const { goal } = context

    return (
      this.tryToCloseSandwichCorrespondingToGoal(goal)
      || this.handleMediaCorrespondingToGoal(goal)
      || ((goal === TokenizerGoal.InlineCode) && this.bufferCurrentChar())
      || ((goal === TokenizerGoal.LinkUrl) && this.closeLinkOrAppendCharToUrl())
      || ((goal === TokenizerGoal.MediaUrl) && this.closeMediaOrAppendCharToUrl())
      || ((goal === TokenizerGoal.SquareBracketed) && this.tryToConvertSquareBracketedContextToLink())
    )
  }

  private closeLinkOrAppendCharToUrl(): boolean {
    return (
      this.tryToOpenSquareBracketedRawText()
      || this.tryToCloseLink()
      || this.bufferCurrentChar())
  }

  private closeMediaOrAppendCharToUrl(): boolean {
    return (
      this.tryToOpenSquareBracketedRawText()
      || this.tryToCloseMedia()
      || this.bufferCurrentChar())
  }

  private tryToCloseSandwichCorrespondingToGoal(goal: TokenizerGoal): boolean {
    return this.allSandwiches.some(sandwich => (sandwich.goal === goal) && this.tryToCloseSandwich(sandwich))
  }

  private handleMediaCorrespondingToGoal(goal: TokenizerGoal): boolean {
    return this.mediaConventions
      .some(media =>
        (media.goal === goal)
        && (
          this.tryToOpenMediaUrl()
          || this.tryToOpenSquareBracketedRawText()
          || this.tryToCloseFalseMediaConvention(goal)
          || this.bufferCurrentChar()))
  }

  private tryToCloseFalseMediaConvention(mediaGoal: TokenizerGoal): boolean {
    if (!CLOSE_SQUARE_BRACKET_PATTERN.test(this.remainingText)) {
      return false
    }

    // If we've encounter a closing square bracket here, it means it's unmatched. If it were matched, it would have
    // been consumed by a SquareBracketedInRawText context.
    //
    // Anyway, we're dealing with something like this: [audio: garbled]
    //
    // That is not a valid media convention, so we need to backtrack!

    this.failMostRecentContextWithGoalAndResetToBeforeIt(mediaGoal)
    return true
  }

  private tryToOpenAnySandwichThatCanAppearInRegularContent(): boolean {
    return this.sandwichesThatCanAppearInRegularContent
      .some(sandwich => this.tryToOpenSandwich(sandwich))
  }

  private tryToOpenParenthesizedRawText(): boolean {
    return this.tryToOpenSandwich(this.parenthesizedRawTextConvention)
  }

  private tryToOpenSquareBracketedRawText(): boolean {
    return this.tryToOpenSandwich(this.squareBracketedRawTextConvention)
  }

  private tryToOpenCurlyBracketedRawText(): boolean {
    return this.tryToOpenSandwich(this.curlyBracketedRawTextConvention)
  }

  private tryToCollectCurrentCharIfEscaped(): boolean {
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

  private tryToOpenNakedUrl(): boolean {
    return this.tryToOpenConvention({
      goal: TokenizerGoal.NakedUrl,
      pattern: NAKED_URL_START_PATTERN,
      then: urlProtocol => {
        this.addTokenAfterFlushingBufferToPlainTextToken(new NakedUrlStartToken(urlProtocol))
      }
    })
  }

  private tryToCloseNakedUrl(): boolean {
    // Whitespace terminates naked URLs, but we don't advance past the whitespace character or do anything with it
    // yet.
    //
    // Instead, we leave the whitespace to be matched by another convention (e.g. a footnote reference, which
    // consumes any leading whitespace).
    if (WHITESPACE_CHAR_PATTERN.test(this.currentChar)) {
      this.closeNakedUrl()
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
          this.addTokenAfterFlushingBufferToPlainTextToken(new media.StartTokenType())
        }
      })
    })
  }
  
  private tryToConvertSquareBracketedContextToLink(): boolean {
    const urlArrowMatchResult =
      LINK_AND_MEDIA_URL_ARROW_PATTERN.exec(this.remainingText)

    if (!urlArrowMatchResult) {
      return false
    }

    const [urlArrow] = urlArrowMatchResult

    const innermostSquareBrackeContextIndex =
      this.getIndexOfInnermostContextWithGoal(TokenizerGoal.SquareBracketed)
      
    const innermostSquareBrackeContext =
      this.openContexts[innermostSquareBrackeContextIndex]

    if (!this.canTry(TokenizerGoal.Link, innermostSquareBrackeContext.snapshot.textIndex)) {
      // If we can't try a link at that location, it means we've already tried and failed to find the closing
      // bracket.
      return false
    }

    // Okay, we're good to go. Let's convert the square bracket context to a link!

    if (this.hasGoal(TokenizerGoal.NakedUrl)) {
      // If we're currently in the middle of a naked URL, we need to close it up. 
      this.closeNakedUrl()
    } else {
      this.flushBufferToPlainTextToken()
    }

    this.advanceTextIndex(urlArrow.length)
    this.openContext({ goal: TokenizerGoal.LinkUrl })

    // Now that we've opened the link URL context, let's replace the square bracket context with a link context. 
    this.openContexts[innermostSquareBrackeContextIndex] = {
      goal: TokenizerGoal.Link,
      snapshot: innermostSquareBrackeContext.snapshot
    }

    // Finally, we need to replace the square bracket context's start token.
    //
    // The token at `innermostSquareBrackeContext.countTokens` is the flushed PlainTextToken created when the
    // context was opened. The next token is the SquareBracketedStartToken we want to replace.
    const indexOfSquareBracketedStartToken = innermostSquareBrackeContext.snapshot.tokens.length + 1

    this.tokens.splice(indexOfSquareBracketedStartToken, 1, new LINK.StartTokenType())
    return true
  }

  private tryToOpenMediaUrl(): boolean {
    return this.tryToOpenConvention({
      goal: TokenizerGoal.MediaUrl,
      pattern: LINK_AND_MEDIA_URL_ARROW_PATTERN,
      then: () => {
        this.addToken(new MediaDescriptionToken(this.flushBufferedText()))
      }
    })
  }

  private tryToCloseLink(): boolean {
    return this.advanceAfterMatch({
      pattern: LINK_END_PATTERN,
      then: () => {
        const url = this.flushBufferedText()
        this.addToken(new LINK.EndTokenType(url))
        this.closeMostRecentContextWithGoal(TokenizerGoal.LinkUrl)
        this.closeMostRecentContextWithGoal(TokenizerGoal.Link)
      }
    })
  }

  private tryToCloseMedia(): boolean {
    return this.advanceAfterMatch({
      pattern: LINK_END_PATTERN,
      then: () => {
        this.addToken(new MediaEndToken(this.flushBufferedText()))
        this.closeMostRecentContextWithGoal(TokenizerGoal.MediaUrl)

        // Once the media URL's context is closed, the media's context is guaranteed to be innermost.
        this.openContexts.pop()
      }
    })
  }

  private closeNakedUrl(): void {
    this.flushBufferedTextToNakedUrlToken()

    // There could be some bracket contexts opened inside the naked URL, and we don't want them to have any impact on
    // any text that follows the URL.
    this.closeMostRecentContextWithGoalAndAnyInnerContexts(TokenizerGoal.NakedUrl)
  }

  private tryToOpenSandwich(sandwich: TokenizableSandwich): boolean {
    return this.tryToOpenConvention({
      goal: sandwich.goal,
      pattern: sandwich.startPattern,
      then: sandwich.onOpen
    })
  }

  private tryToCloseSandwich(sandwich: TokenizableSandwich): boolean {
    return this.advanceAfterMatch({
      pattern: sandwich.endPattern,
      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        this.closeMostRecentContextWithGoal(sandwich.goal)
        sandwich.onClose(match, isTouchingWordEnd, isTouchingWordStart, ...captures)
      }
    })
  }

  private tryToOpenConvention(
    args: {
      goal: TokenizerGoal,
      pattern: RegExp,
      then: OnTokenizerMatch
    }
  ): boolean {
    const { goal, pattern, then } = args

    return this.canTry(goal) && this.advanceAfterMatch({
      pattern,
      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        this.openContext({ goal })
        then(match, isTouchingWordEnd, isTouchingWordStart, ...captures)
      }
    })
  }

  private openContext(args: { goal: TokenizerGoal }): void {
    this.openContexts.push(this.getContext({ goal: args.goal }))
  }
  
  private getContext(args: { goal: TokenizerGoal }): TokenizerContext {
    return {
      goal: args.goal,
      snapshot: this.getSnapshot()
    }
  }
  
  private getSnapshot(): TokenizerSnapshot {
    return new TokenizerSnapshot({
        textIndex: this.textIndex,
        tokens: this.tokens,
        openContexts: this.openContexts,
        bufferedText: this.bufferedText
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

        // If a link URL is unclosed, that means the link itself is unclosed, too. We'll let the default
        // handler (below) backtrack to before the link itself.
        case TokenizerGoal.LinkUrl:

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
    this.failedGoalTracker.registerFailure(context)

    this.textIndex = context.snapshot.textIndex
    this.tokens = context.snapshot.tokens
    this.openContexts = context.snapshot.openContexts
    this.bufferedText = context.snapshot.bufferedText

    this.updateComputedTextFields()
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

      if (context.goal === TokenizerGoal.NakedUrl) {
        // As a rule, if a convention enclosing a naked URL is closed, the naked URL gets closed, too (along with
        // any inner brackets).
        this.closeNakedUrl()
      }
    }

    throw new Error(`Goal was missing: ${TokenizerGoal[goal]}`)
  }

  private closeMostRecentContextWithGoalAndAnyInnerContexts(goal: TokenizerGoal): void {
    while (this.openContexts.length) {
      const context = this.openContexts.pop()

      if (context.goal === goal) {
        return
      }
    }

    throw new Error(`Goal was missing: ${TokenizerGoal[goal]}`)
  }

  private getIndexOfInnermostContextWithGoal(goal: TokenizerGoal): number {
    for (let i = this.openContexts.length - 1; i >= 0; i--) {
      if (this.openContexts[i].goal === goal) {
        return i
      }
    }

    throw new Error(`Goal was missing: ${TokenizerGoal[goal]}`)
  }

  private flushBufferedTextToNakedUrlToken(): void {
    this.addToken(new NakedUrlEndToken(this.flushBufferedText()))
  }

  private addTokenAfterFlushingBufferToPlainTextToken(token: Token): void {
    this.flushBufferToPlainTextToken()
    this.addToken(token)
  }

  private hasGoal(goal: TokenizerGoal): boolean {
    return this.openContexts.some(context => context.goal === goal)
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

  private updateComputedTextFields(): void {
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
      goal: richConvention.tokenizerGoal,
      startPattern,
      endPattern,
      onOpen: () => this.addTokenAfterFlushingBufferToPlainTextToken(new richConvention.StartTokenType()),
      onClose: () => this.addTokenAfterFlushingBufferToPlainTextToken(new richConvention.EndTokenType())
    })
  }

  private getBracketInsideUrlConvention(
    args: {
      goal: TokenizerGoal,
      openBracketPattern: string,
      closeBracketPattern: string
    }
  ): TokenizableSandwich {
    const bufferBracket = (bracket: string) => {
      this.bufferedText += bracket
    }

    return new TokenizableSandwich({
      goal: args.goal,
      startPattern: args.openBracketPattern,
      endPattern: args.closeBracketPattern,
      onOpen: bufferBracket,
      onClose: bufferBracket
    })
  }

  private tryToTokenizeRaisedVoicePlaceholders(): boolean {
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

      resultTokens.push(token)

      addBracketIfTokenIs('(', PARENTHESIZED.StartTokenType)
      addBracketIfTokenIs('[', SQUARE_BRACKETED.StartTokenType)
    }

    return resultTokens
  }

  private addToken(token: Token): void {
    this.tokens.push(token)
  }

  private reachedEndOfText(): boolean {
    return !this.remainingText
  }

  private advanceTextIndex(length: number): void {
    this.textIndex += length
    this.updateComputedTextFields()
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

  private canTry(goal: TokenizerGoal, textIndex = this.textIndex): boolean {
    return !this.failedGoalTracker.hasFailed(goal, textIndex)
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
