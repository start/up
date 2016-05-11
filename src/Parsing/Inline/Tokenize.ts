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
import { RevisionInsertionStartToken } from './Tokens/RevisionInsertionStartToken'
import { RevisionInsertionEndToken } from './Tokens/RevisionInsertionEndToken'
import { RevisionDeletionStartToken } from './Tokens/RevisionDeletionStartToken'
import { RevisionDeletionEndToken } from './Tokens/RevisionDeletionEndToken'
import { Token, TokenType } from './Tokens/Token'
import { PotentialRaisedVoiceTokenType } from './Tokens/PotentialRaisedVoiceToken'
import { startsWith, atLeast, ANY_WHITESPACE, WHITESPACE_CHAR, NON_WHITESPACE_CHAR, optional } from '../Patterns'

export function tokenize(text: string, config: UpConfig): Token[] {
  const tokens = new Tokenizer(text, config).tokens

  const tokensWithRaisedVoicesApplied =
    applyRaisedVoicesToRawTokens(tokens)

  return massageTokensIntoTreeStructure(tokensWithRaisedVoicesApplied)
}


const NON_WHITESPACE_CHAR_PATTERN = new RegExp(
  NON_WHITESPACE_CHAR
)

const RAISED_VOICE_DELIMITER_PATTERN = new RegExp(
  startsWith(atLeast(1, escapeForRegex('*')))
)

const LINK_START_PATTERN = new RegExp(
  startsWith(escapeForRegex('['))
)

const LINK_AND_MEDIA_URL_ARROW_PATTERN = new RegExp(
  startsWith(ANY_WHITESPACE + '->' + ANY_WHITESPACE)
)

const LINK_END_PATTERN = new RegExp(
  startsWith(escapeForRegex(']'))
)

const NAKED_URL_START_PATTERN = new RegExp(
  startsWith('http' + optional('s') + '://')
)

const WHITESPACE_CHAR_PATTERN = new RegExp(
  startsWith(ANY_WHITESPACE)
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

  // These conventions don't produce any distinct syntax nodes, and they don't need to be closed. Their
  // purpose is to ensure that any conventions whose delimiters contain parentheses or square brackets
  // can contain parenthesized or "square bracketed" text.
  private parenthesizedConvention: TokenizableSandwich
  private squareBracketedConvention: TokenizableSandwich

  private mediaConventions: TokenizableMedia[]

  constructor(private entireText: string, private config: UpConfig) {
    this.footnoteConvention =
      this.getTypicalSandwichConvention({
        state: TokenizerState.Spoiler,
        startPattern: ANY_WHITESPACE + escapeForRegex('(('),
        endPattern: escapeForRegex('))'),
        richConvention: FOOTNOTE
      })

    this.spoilerConvention =
      this.getTypicalSandwichConvention({
        state: TokenizerState.Spoiler,
        startPattern: escapeForRegex('[' + this.config.settings.i18n.terms.spoiler + ':') + ANY_WHITESPACE,
        endPattern: escapeForRegex(']'),
        richConvention: SPOILER
      })

    this.revisionDeletionConvention =
      this.getTypicalSandwichConvention({
        state: TokenizerState.RevisionDeletion,
        startPattern: '~~',
        endPattern: '~~',
        richConvention: REVISION_DELETION
      })

    this.revisionInsertionConvention =
      this.getTypicalSandwichConvention({
        state: TokenizerState.RevisionInsertion,
        startPattern: escapeForRegex('++'),
        endPattern: escapeForRegex('++'),
        richConvention: REVISION_INSERTION
      })

    this.parenthesizedConvention =
      this.getBracketedConvention(TokenizerState.Parenthesized, '(', ')')

    this.squareBracketedConvention =
      this.getBracketedConvention(TokenizerState.SquareBracketed, '[', ']')

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

      if (this.failed()) {
        this.undoLatestFailedContext()
      }

      if (this.reachedEndOfText()) {
        break
      }

      if (this.collectCurrentCharIfEscaped()) {
        continue
      }

      for (let i = this.openContexts.length - 1; i >= 0; i--) {
        let context = this.openContexts[i]
        const { state } = context

        if (state === TokenizerState.InlineCode) {
          if (!this.closeSandwich(this.inlineCodeConvention)) {
            this.collectCurrentChar()
          }

          continue LoopCharacters
        }

        if (state === TokenizerState.LinkUrl) {
          const openedSquareBracketOrClosedLink =
            this.openSandwich(this.squareBracketedConvention) || this.closeLink()

          if (!openedSquareBracketOrClosedLink) {
            this.collectCurrentChar()
          }

          continue LoopCharacters
        }

        if (state === TokenizerState.MediaUrl) {
          const openedSquareBracketOrClosedMedia =
            this.openSandwich(this.squareBracketedConvention) || this.closeMedia()

          if (!openedSquareBracketOrClosedMedia) {
            this.collectCurrentChar()
          }

          continue LoopCharacters
        }

        for (const sandwich of [
          this.spoilerConvention,
          this.footnoteConvention,
          this.revisionDeletionConvention,
          this.revisionInsertionConvention,
          this.squareBracketedConvention,
          this.parenthesizedConvention
        ]) {
          if (state === sandwich.state && this.closeSandwich(sandwich)) {
            continue LoopCharacters
          }
        }

        if (state === TokenizerState.NakedUrl) {
          if (this.closeNakedUrl()) {
            continue
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

        if (state === TokenizerState.Link) {
          if (this.openLinkUrlOrUndoPrematureLink()) {
            continue LoopCharacters
          }
        }
      }

      const openedConvention = (
        this.tokenizeRaisedVoicePlaceholders()
        || this.openSandwich(this.inlineCodeConvention)
        || this.openSandwich(this.spoilerConvention)
        || this.openSandwich(this.footnoteConvention)
        || this.openSandwich(this.revisionDeletionConvention)
        || this.openSandwich(this.revisionInsertionConvention)
        || this.openMedia()
        || this.openLink()
        || this.openSandwich(this.parenthesizedConvention)
        || this.openSandwich(this.squareBracketedConvention)
      )

      if (!openedConvention) {
        this.collectCurrentChar()
      }
    }

    this.flushUnmatchedTextToPlainTextToken()
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

  private failed(): boolean {
    return (
      this.reachedEndOfText()
      && this.openContexts.some(context => context.mustClose)
    )
  }

  private undoLatestFailedContext(args?: { where: (context: TokenizerContext) => boolean }): void {
    while (this.openContexts.length) {
      const context = this.openContexts.pop()

      if (context.mustClose && (!args || args.where(context))) {
        this.failedStateTracker.registerFailure(context)

        this.textIndex = context.textIndex
        this.tokens.splice(context.countTokens)
        this.openContexts = context.openContexts
        this.plainTextBuffer = context.plainTextBuffer

        this.currentToken = last(this.tokens)
        this.dirty()

        return
      }
    }
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
    const unmatchedText = this.flushUnmatchedText()

    if (unmatchedText) {
      this.addToken(new PlainTextToken(unmatchedText))
    }
  }

  private canTry(state: TokenizerState): boolean {
    return !this.failedStateTracker.hasFailed(state, this.textIndex)
  }

  private openNakedUrl(): boolean {
    return !this.hasState(TokenizerState.Link) && this.hasState(TokenizerState.Link) && this.openConvention({
      state: TokenizerState.Link,
      pattern: NAKED_URL_START_PATTERN,
      then: (urlProtocol) => {
        this.addTokenAfterFlushingUnmatchedTextToPlainTextToken(new NakedUrlToken(urlProtocol))
      },
      mustClose: true
    })
  }

  private closeNakedUrl(): boolean {
    if (!WHITESPACE_CHAR_PATTERN.test(this.currentChar)) {
      return false
    }
    
    // We don't want to advance past the whitespace character! We leave the whitespace character to be matched by another
    // convention (e.g. the leading space for footnote reference).

    return true
  }

  private openLink(): boolean {
    return !this.hasState(TokenizerState.Link) && this.openConvention({
      state: TokenizerState.Link,
      pattern: LINK_START_PATTERN,
      then: () => {
        this.addTokenAfterFlushingUnmatchedTextToPlainTextToken(new LINK.StartTokenType())
      },
      mustClose: true
    })
  }

  private openMedia(): boolean {
    for (let media of this.mediaConventions) {
      const openedMediaConvention = this.openConvention({
        state: media.state,
        pattern: media.startPattern,
        then: () => {
          this.addTokenAfterFlushingUnmatchedTextToPlainTextToken(new media.TokenType())
        },
        mustClose: true
      })

      if (openedMediaConvention) {
        return true
      }
    }

    return false
  }

  private openLinkUrlOrUndoPrematureLink(): boolean {
    const didStartLinkUrl =
      this.hasState(TokenizerState.Link) && this.openConvention({
        state: TokenizerState.LinkUrl,
        pattern: LINK_AND_MEDIA_URL_ARROW_PATTERN,
        then: () => {
          this.flushUnmatchedTextToPlainTextToken()
        },
        // If we fail to find the final closing bracket, we want to backtrack to the opening bracket, not
        // to the URL arrow. We set the link context's `mustClose` to true.
        mustClose: false
      })

    if (!didStartLinkUrl) {
      return false
    }

    for (let i = this.openContexts.length - 1; i >= 0; i--) {
      let openContext = this.openContexts[i]

      if (openContext.state === TokenizerState.SquareBracketed) {
        // If we've encountered any unclosed square brackets since starting the link, it means we started
        // the link too early.
        //
        // We're looking at either:
        //
        // 1. A bracketed link, which should start with the second opening bracket:
        //  
        //    [I use [Google -> https://google.com]]
        //
        // 2. A bracketed link missing the second closing bracket, which should still start with the second
        //    opening bracket:
        //   
        //    Go to [this [site -> https://stackoverflow.com]! 
        //
        // TODO: Don't produce link context until the URL arrow is found inside bracketed text

        this.undoLink()
        break
      }

      if (openContext.state === TokenizerState.Link) {
        break
      }
    }

    return true
  }

  private openMediaUrl(): boolean {
    return this.openConvention({
      state: TokenizerState.MediaUrl,
      pattern: LINK_AND_MEDIA_URL_ARROW_PATTERN,
      then: () => {
        (<MediaToken>this.currentToken).description = this.flushUnmatchedText()
      },
      // If we fail to find the final closing bracket, we want to backtrack to the opening bracket, not
      // to the URL arrow. We set the media context's `mustClose` to true.
      mustClose: false
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

        // Once the media URL's context is closed, the media's context is innermost.
        this.closeInnermostContext()
      }
    })
  }

  // This method isn't called once we start tokenizing a link's URL.
  private undoLinkThatWasActuallyBracketedText(): boolean {
    if (this.hasState(TokenizerState.Link) && this.advanceAfterMatch({ pattern: LINK_END_PATTERN })) {
      this.undoLink()
      return true
    }

    return false
  }

  private undoLink(): void {
    this.undoLatestFailedContext({
      where: (context) => context.state === TokenizerState.Link
    })
  }

  private openSandwich(sandwich: TokenizableSandwich): boolean {
    return this.openConvention({
      state: sandwich.state,
      pattern: sandwich.startPattern,
      then: sandwich.onOpen,
      mustClose: sandwich.mustClose
    })
  }

  private closeSandwich(sandwich: TokenizableSandwich): boolean {
    const { state, endPattern, onClose } = sandwich

    return this.hasState(state) && this.advanceAfterMatch({
      pattern: endPattern,
      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        this.closeMostRecentContextWithState(state)
        onClose(match, isTouchingWordEnd, isTouchingWordStart, ...captures)
      }
    })
  }

  private closeSandwichIfInnermost(sandwich: TokenizableSandwich): boolean {
    const { state, endPattern, onClose } = sandwich

    return this.innermostStateIs(state) && this.advanceAfterMatch({
      pattern: endPattern,
      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        this.openContexts.pop()
        onClose(match, isTouchingWordEnd, isTouchingWordStart, ...captures)
      }
    })
  }

  private openConvention(
    args: {
      state: TokenizerState,
      pattern: RegExp,
      then: OnTokenizerMatch,
      mustClose: boolean
    }
  ): boolean {
    const { state, pattern, then, mustClose } = args

    return this.canTry(state) && this.advanceAfterMatch({
      pattern: pattern,

      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        this.openContexts.push(
          new TokenizerContext({
            state: state,
            textIndex: this.textIndex,
            countTokens: this.tokens.length,
            openContexts: this.openContexts,
            plainTextBuffer: this.plainTextBuffer,
            mustClose: mustClose
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

  private closeBracketsIfTheyAreInnermost(): boolean {
    return (
      this.closeSandwichIfInnermost(this.parenthesizedConvention)
      || this.closeSandwichIfInnermost(this.squareBracketedConvention)
    )
  }

  private closeMostRecentContextWithState(state: TokenizerState): void {
    for (let i = 0; i < this.openContexts.length; i++) {
      if (this.openContexts[i].state === state) {
        this.openContexts.splice(i, 1)
        return
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

  private innermostStateIs(state: TokenizerState): boolean {
    return (this.openContexts.length && last(this.openContexts).state === state)
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

  private getBracketedConvention(state: TokenizerState, openBracket: string, closeBracket: string): TokenizableSandwich {
    const addBracketToBuffer = (bracket: string) => {
      this.plainTextBuffer += bracket
    }

    return new TokenizableSandwich({
      state: state,
      startPattern: escapeForRegex(openBracket),
      endPattern: escapeForRegex(closeBracket),
      onOpen: addBracketToBuffer,
      onClose: addBracketToBuffer,
      mustClose: false
    })
  }

  private getTypicalSandwichConvention(
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
