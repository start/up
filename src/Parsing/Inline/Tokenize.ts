import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { MediaToken } from './Tokens/MediaToken'
import { OnTokenizerMatch } from './OnTokenizerMatch'
import { TokenizerState } from './TokenizerState'
import { TokenizableSandwich } from './TokenizableSandwich'
import { TokenizableMedia } from './TokenizableMedia'
import { FailedStateTracker } from './FailedStateTracker'
import { TokenizerContext } from './TokenizerContext'
import { RichConvention } from './RichConvention'
import { last, lastChar, swap } from '../CollectionHelpers'
import { escapeForRegex } from '../TextHelpers'
import { applyRaisedVoicesToRawTokens }  from './RaisedVoices/ApplyRaisedVoicesToRawTokens'
import { AUDIO, IMAGE, VIDEO } from './MediaConventions'
import { REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE, LINK } from './RichConventions'
import { massageTokensIntoTreeStructure } from './MassageTokensIntoTreeStructure'
import { UpConfig } from '../../UpConfig'
import { EmphasisEndToken } from './Tokens/EmphasisEndToken'
import { EmphasisStartToken } from './Tokens/EmphasisStartToken'
import { FootnoteEndToken } from './Tokens/FootnoteEndToken'
import { FootnoteStartToken } from './Tokens/FootnoteStartToken'
import { InlineCodeToken } from './Tokens/InlineCodeToken'
import { PlainTextToken } from './Tokens/PlainTextToken'
import { PotentialRaisedVoiceEndToken } from './Tokens/PotentialRaisedVoiceEndToken'
import { PotentialRaisedVoiceStartOrEndToken } from './Tokens/PotentialRaisedVoiceStartOrEndToken'
import { PotentialRaisedVoiceStartToken } from './Tokens/PotentialRaisedVoiceStartToken'
import { SpoilerEndToken } from './Tokens/SpoilerEndToken'
import { SpoilerStartToken } from './Tokens/SpoilerStartToken'
import { StressEndToken } from './Tokens/StressEndToken'
import { StressStartToken } from './Tokens/StressStartToken'
import { NakedUrlToken } from './Tokens/NakedUrlToken'
import { ParenthesizedStartToken } from './Tokens/ParenthesizedStartToken'
import { ParenthesizedEndToken } from './Tokens/ParenthesizedEndToken'
import { SquareBracketedStartToken } from './Tokens/SquareBracketedStartToken'
import { SquareBracketedEndToken } from './Tokens/SquareBracketedEndToken'
import { RevisionInsertionStartToken } from './Tokens/RevisionInsertionStartToken'
import { RevisionInsertionEndToken } from './Tokens/RevisionInsertionEndToken'
import { RevisionDeletionStartToken } from './Tokens/RevisionDeletionStartToken'
import { RevisionDeletionEndToken } from './Tokens/RevisionDeletionEndToken'
import { Token, TokenType } from './Tokens/Token'
import { PotentialRaisedVoiceTokenType } from './Tokens/PotentialRaisedVoiceToken'
import { startsWith, atLeast, ANY_WHITESPACE, WHITESPACE_CHAR, NON_WHITESPACE_CHAR, optional } from '../Patterns'

export function tokenize(text: string, config: UpConfig): Token[] {
  return new Tokenizer(text, config).tokens
}


const OPEN_SQUARE_BRACKET =
  escapeForRegex('[')

const CLOSE_SQUARE_BRACKET =
  escapeForRegex(']')

const OPEN_PAREN =
  escapeForRegex('(')

const CLOSE_PAREN =
  escapeForRegex('(')


const RAISED_VOICE_DELIMITER_PATTERN = new RegExp(
  startsWith(atLeast(1, escapeForRegex('*')))
)

const LINK_START_PATTERN = new RegExp(
  startsWith(OPEN_SQUARE_BRACKET)
)

const LINK_AND_MEDIA_URL_ARROW_PATTERN = new RegExp(
  startsWith(ANY_WHITESPACE + '->' + ANY_WHITESPACE)
)

const LINK_END_PATTERN = new RegExp(
  startsWith(CLOSE_SQUARE_BRACKET)
)

const NAKED_URL_START_PATTERN = new RegExp(
  startsWith('http' + optional('s') + '://')
)

const WHITESPACE_CHAR_PATTERN = new RegExp(
  WHITESPACE_CHAR
)

const NON_WHITESPACE_CHAR_PATTERN = new RegExp(
  NON_WHITESPACE_CHAR
)


class Tokenizer {
  public tokens: Token[] = []

  private textIndex = 0

  // These three fields are computer based on `textIndex`.
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
  private plainTextBuffer = ''

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

  private mediaConventions: TokenizableMedia[]

  constructor(private entireText: string, private config: UpConfig) {
    this.footnoteConvention =
      this.getRichSandwichConvention({
        state: TokenizerState.Spoiler,
        startPattern: ANY_WHITESPACE + escapeForRegex('(('),
        endPattern: escapeForRegex('))'),
        richConvention: FOOTNOTE
      })

    this.spoilerConvention =
      this.getRichSandwichConvention({
        state: TokenizerState.Spoiler,
        startPattern: escapeForRegex('[' + this.config.settings.i18n.terms.spoiler + ':') + ANY_WHITESPACE,
        endPattern: escapeForRegex(']'),
        richConvention: SPOILER
      })

    this.revisionDeletionConvention =
      this.getRichSandwichConvention({
        state: TokenizerState.RevisionDeletion,
        startPattern: '~~',
        endPattern: '~~',
        richConvention: REVISION_DELETION
      })

    this.revisionInsertionConvention =
      this.getRichSandwichConvention({
        state: TokenizerState.RevisionInsertion,
        startPattern: escapeForRegex('++'),
        endPattern: escapeForRegex('++'),
        richConvention: REVISION_INSERTION
      })

    this.parenthesizedConvention =
      new TokenizableSandwich({
        state: TokenizerState.Parenthesized,
        startPattern: OPEN_PAREN,
        endPattern: CLOSE_PAREN,
        onOpen: () => {
          this.addTokenAfterFlushingUnmatchedTextToPlainTextToken(new ParenthesizedStartToken())
        },
        onClose: () => {
          this.addTokenAfterFlushingUnmatchedTextToPlainTextToken(new ParenthesizedStartToken())
        }
      })

    this.squareBracketedConvention =
      new TokenizableSandwich({
        state: TokenizerState.SquareBracketed,
        startPattern: OPEN_SQUARE_BRACKET,
        endPattern: CLOSE_SQUARE_BRACKET,
        onOpen: () => {
          this.addTokenAfterFlushingUnmatchedTextToPlainTextToken(new SquareBracketedStartToken())
        },
        onClose: () => {
          this.addTokenAfterFlushingUnmatchedTextToPlainTextToken(new SquareBracketedEndToken())
        }
      })

    const addBracketToBuffer = (bracket: string) => {
      this.plainTextBuffer += bracket
    }

    this.parenthesizedInsideUrlConvention =
      new TokenizableSandwich({
        state: TokenizerState.ParenthesizedInsideUrl,
        startPattern: OPEN_SQUARE_BRACKET,
        endPattern: CLOSE_SQUARE_BRACKET,
        onOpen: addBracketToBuffer,
        onClose: addBracketToBuffer
      })

    this.squareBracketedInsideUrlConvention = new TokenizableSandwich({
      state: TokenizerState.SquareBracketedInsideUrl,
      startPattern: OPEN_SQUARE_BRACKET,
      endPattern: CLOSE_SQUARE_BRACKET,
      onOpen: addBracketToBuffer,
      onClose: addBracketToBuffer
    })

    this.inlineCodeConvention = new TokenizableSandwich({
      state: TokenizerState.InlineCode,
      startPattern: '`',
      endPattern: '`',
      onOpen: () => {
        this.flushUnmatchedTextToPlainTextToken()
      },
      onClose: () => {
        this.addToken(new InlineCodeToken(this.flushUnmatchedText()))
      }
    })

    this.mediaConventions = [AUDIO, IMAGE, VIDEO].map(media =>
      new TokenizableMedia(media.TokenType, media.state, this.config.localize(media.nonLocalizedTerm)))

    this.dirty()
    this.tokenize()
  }

  private tokenize(): void {
    LoopCharacters: while (true) {

      if (this.reachedEndOfText()) {
        if (this.finalize()) {
          break
        }
      }

      if (this.collectCurrentCharIfEscaped()) {
        continue
      }

      const currentOpenContext = last(this.openContexts)

      if (currentOpenContext && currentOpenContext.state == TokenizerState.InlineCode) {
        if (!this.closeSandwich(this.inlineCodeConvention)) {
          this.collectCurrentChar()
        }

        continue
      }

      for (let i = this.openContexts.length - 1; i >= 0; i--) {
        let context = this.openContexts[i]
        const { state } = context

        for (const sandwich of [
          this.spoilerConvention,
          this.footnoteConvention,
          this.revisionDeletionConvention,
          this.revisionInsertionConvention,
          this.squareBracketedConvention,
          this.parenthesizedConvention,
          this.squareBracketedInsideUrlConvention,
          this.parenthesizedInsideUrlConvention
        ]) {
          if (state === sandwich.state && this.closeSandwich(sandwich)) {
            continue LoopCharacters
          }
        }

        for (const media of this.mediaConventions) {
          if (state === media.state) {
            if (!this.openMediaUrl()) {
              this.collectCurrentChar()
            }

            continue LoopCharacters
          }
        }

        switch (state) {
          case TokenizerState.LinkUrl: {
            const openedSquareBracketOrClosedLink =
              this.openSandwich(this.squareBracketedInsideUrlConvention) || this.closeLink()

            if (!openedSquareBracketOrClosedLink) {
              this.collectCurrentChar()
            }

            continue LoopCharacters
          }

          case TokenizerState.MediaUrl: {
            const openedSquareBracketOrClosedMedia =
              this.openSandwich(this.squareBracketedInsideUrlConvention) || this.closeMedia()

            if (!openedSquareBracketOrClosedMedia) {
              this.collectCurrentChar()
            }

            continue LoopCharacters
          }

          case TokenizerState.NakedUrl: {
            if (this.tryCloseNakedUrl()) {
              continue LoopCharacters
            }

            break
          }
        }
      }

      if (this.hasState(TokenizerState.NakedUrl)) {
        const didOpenBracket = (
          this.openSandwich(this.parenthesizedInsideUrlConvention)
          || this.openSandwich(this.squareBracketedInsideUrlConvention)
        )

        if (!didOpenBracket) {
          this.collectCurrentChar()
        }

        continue
      }

      if (this.hasState(TokenizerState.SquareBracketed) && this.convertSquareBracketedContextToLink()) {
        continue
      }

      const openedConvention = (
        this.tokenizeRaisedVoicePlaceholders()
        || this.openSandwich(this.inlineCodeConvention)
        || this.openSandwich(this.spoilerConvention)
        || this.openSandwich(this.footnoteConvention)
        || this.openSandwich(this.revisionDeletionConvention)
        || this.openSandwich(this.revisionInsertionConvention)
        || this.openMedia()
        || this.openSandwich(this.parenthesizedConvention)
        || this.openSandwich(this.squareBracketedConvention)
        || this.openNakedUrl()
      )

      if (!openedConvention) {
        this.collectCurrentChar()
      }
    }

    this.tokens =
      massageTokensIntoTreeStructure(
        applyRaisedVoicesToRawTokens(this.tokens))
  }

  private collectCurrentCharIfEscaped(): boolean {
    const ESCAPE_CHAR = '\\'

    if (this.currentChar !== ESCAPE_CHAR) {
      return false
    }

    this.advance(1)

    if (!this.reachedEndOfText()) {
      this.collectCurrentChar()
    }

    return true
  }

  private addToken(token: Token): void {
    this.currentToken = token
    this.tokens.push(token)
  }

  private reachedEndOfText(): boolean {
    return !this.remainingText
  }

  private finalize(): boolean {
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
          this.backtrackToBeforeContext(context)
          return false
      }
    }

    this.flushUnmatchedTextToPlainTextToken()

    return true
  }

  private backtrackToBeforeLatestContextWithState(state: TokenizerState): void {
    while (this.openContexts.length) {
      const context = this.openContexts.pop()

      if (context.state === state) {
        this.backtrackToBeforeContext(context)
      }
    }
  }

  private backtrackToBeforeContext(context: TokenizerContext): void {
    this.failedStateTracker.registerFailure(context)

    this.textIndex = context.textIndex
    this.tokens.splice(context.countTokens)
    this.openContexts = context.openContexts
    this.plainTextBuffer = context.plainTextBuffer

    this.currentToken = last(this.tokens)
    this.dirty()
  }

  private advance(length: number): void {
    this.textIndex += length
    this.dirty()
  }

  private collectCurrentChar(): void {
    this.plainTextBuffer += this.currentChar
    this.advance(1)
  }

  private flushUnmatchedText(): string {
    const unmatchedText = this.plainTextBuffer
    this.plainTextBuffer = ''

    return unmatchedText
  }

  private flushUnmatchedTextToPlainTextToken(): void {
    // This will create a PlainTextToken even when there isn't any text to flush.
    //
    // TODO: Explain why this is helpful
    this.addToken(new PlainTextToken(this.flushUnmatchedText()))
  }

  private canTry(state: TokenizerState, textIndex = this.textIndex): boolean {
    return !this.failedStateTracker.hasFailed(state, textIndex)
  }

  private openNakedUrl(): boolean {
    return !this.hasState(TokenizerState.Link) && this.openConvention({
      state: TokenizerState.NakedUrl,
      pattern: NAKED_URL_START_PATTERN,
      then: (urlProtocol) => {
        this.addTokenAfterFlushingUnmatchedTextToPlainTextToken(new NakedUrlToken(urlProtocol))
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
    (<NakedUrlToken>this.currentToken).restOfUrl = this.flushUnmatchedText()
  }

  private openMedia(): boolean {
    for (let media of this.mediaConventions) {
      const openedMediaConvention = this.openConvention({
        state: media.state,
        pattern: media.startPattern,
        then: () => {
          this.addTokenAfterFlushingUnmatchedTextToPlainTextToken(new media.TokenType())
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
        then: () => {
          this.flushUnmatchedTextToPlainTextToken()
        }
      })

    if (!didStartLinkUrl) {
      return false
    }

    const squareBrackeContext =
      this.getInnermostContextWithState(TokenizerState.SquareBracketed)

    if (!this.canTry(TokenizerState.Link, squareBrackeContext.textIndex)) {
      return false
    }

    squareBrackeContext.state = TokenizerState.Link
    
    // The token at `countTokens` is the flushed PlainTextToken. The next one is the SquareBracketedStartToken
    // we want to replace with a LinkStartToken.
    const indexOfSquareBracketedStartToken =
      squareBrackeContext.countTokens + 1
      
    this.tokens.splice(indexOfSquareBracketedStartToken, 1, new LINK.StartTokenType())
  }

  private openMediaUrl(): boolean {
    return this.openConvention({
      state: TokenizerState.MediaUrl,
      pattern: LINK_AND_MEDIA_URL_ARROW_PATTERN,
      then: () => {
        (<MediaToken>this.currentToken).description = this.flushUnmatchedText()
      }
    })
  }

  private closeLink(): boolean {
    return this.advanceAfterMatch({
      pattern: LINK_END_PATTERN,
      then: () => {
        const url = this.flushUnmatchedText()
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
        (<MediaToken>this.currentToken).url = this.flushUnmatchedText()
        this.closeMostRecentContextWithState(TokenizerState.MediaUrl)

        // Once the media URL's context is closed, the media's context is guaranteed to be innermost.
        this.closeInnermostContext()
      }
    })
  }

  private backtrackToBeforeLink(): void {
    this.backtrackToBeforeLatestContextWithState(TokenizerState.Link)
  }

  private openSandwich(sandwich: TokenizableSandwich): boolean {
    return this.openConvention({
      state: sandwich.state,
      pattern: sandwich.startPattern,
      then: sandwich.onOpen
    })
  }

  private closeSandwich(sandwich: TokenizableSandwich): boolean {
    const { state, endPattern, onClose } = sandwich

    return this.advanceAfterMatch({
      pattern: endPattern,
      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        this.closeMostRecentContextWithState(state)
        onClose(match, isTouchingWordEnd, isTouchingWordStart, ...captures)
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
        this.openContexts.push(
          new TokenizerContext({
            state: state,
            textIndex: this.textIndex,
            countTokens: this.tokens.length,
            openContexts: this.openContexts,
            plainTextBuffer: this.plainTextBuffer
          }))

        then(match, isTouchingWordEnd, isTouchingWordStart, ...captures)
      }
    })
  }

  private openBracketedText(): boolean {
    return (
      this.openSandwich(this.parenthesizedConvention)
      || this.openSandwich(this.squareBracketedConvention)
    )
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

  private addTokenAfterFlushingUnmatchedTextToPlainTextToken(token: Token): void {
    this.flushUnmatchedTextToPlainTextToken()
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

    const match = result[0]
    const captures = result.slice(1)

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

  private getRichSandwichConvention(
    args: {
      state: TokenizerState,
      startPattern: string,
      endPattern: string,
      richConvention: RichConvention
    }
  ): TokenizableSandwich {
    const { state, startPattern, endPattern, richConvention } = args

    return new TokenizableSandwich({
      state: state,
      startPattern: startPattern,
      endPattern: endPattern,
      onOpen: () => {
        this.addTokenAfterFlushingUnmatchedTextToPlainTextToken(new richConvention.StartTokenType())
      },
      onClose: () => {
        this.addTokenAfterFlushingUnmatchedTextToPlainTextToken(new richConvention.EndTokenType())
      }
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

        this.addTokenAfterFlushingUnmatchedTextToPlainTextToken(new AsteriskTokenType(asterisks))
      }
    })
  }
}
