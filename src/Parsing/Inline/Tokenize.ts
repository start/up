import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { OnTokenizerMatch } from './OnTokenizerMatch'
import { TokenizerState } from './TokenizerState'
import { TokenizableSandwich } from './TokenizableSandwich'
import { FailedStateTracker } from './FailedStateTracker'
import { TokenizerContext } from './TokenizerContext'
import { InfallibleTokenizerContext } from './InfallibleTokenizerContext'
import { FallibleTokenizerContext } from './FallibleTokenizerContext'
import { RichConvention } from './RichConvention'
import { last, lastChar, swap } from '../CollectionHelpers'
import { escapeForRegex } from '../TextHelpers'
import { applyRaisedVoicesToRawTokens }  from './RaisedVoices/ApplyRaisedVoicesToRawTokens'
import { AUDIO, IMAGE, VIDEO } from './MediaConventions'
import { massageTokensIntoTreeStructure } from './MassageTokensIntoTreeStructure'
import { UpConfig } from '../../UpConfig'
import { AudioToken } from './Tokens/AudioToken'
import { EmphasisEndToken } from './Tokens/EmphasisEndToken'
import { EmphasisStartToken } from './Tokens/EmphasisStartToken'
import { FootnoteEndToken } from './Tokens/FootnoteEndToken'
import { FootnoteStartToken } from './Tokens/FootnoteStartToken'
import { ImageToken } from './Tokens/ImageToken'
import { InlineCodeToken } from './Tokens/InlineCodeToken'
import { LinkStartToken } from './Tokens/LinkStartToken'
import { LinkEndToken } from './Tokens/LinkEndToken'
import { PlainTextToken } from './Tokens/PlainTextToken'
import { PotentialRaisedVoiceEndToken } from './Tokens/PotentialRaisedVoiceEndToken'
import { PotentialRaisedVoiceStartOrEndToken } from './Tokens/PotentialRaisedVoiceStartOrEndToken'
import { PotentialRaisedVoiceStartToken } from './Tokens/PotentialRaisedVoiceStartToken'
import { SpoilerEndToken } from './Tokens/SpoilerEndToken'
import { SpoilerStartToken } from './Tokens/SpoilerStartToken'
import { StressEndToken } from './Tokens/StressEndToken'
import { StressStartToken } from './Tokens/StressStartToken'
import { RevisionInsertionStartToken } from './Tokens/RevisionInsertionStartToken'
import { RevisionInsertionEndToken } from './Tokens/RevisionInsertionEndToken'
import { RevisionDeletionStartToken } from './Tokens/RevisionDeletionStartToken'
import { RevisionDeletionEndToken } from './Tokens/RevisionDeletionEndToken'
import { VideoToken } from './Tokens/VideoToken'
import { Token, TokenType } from './Tokens/Token'
import { PotentialRaisedVoiceTokenType } from './Tokens/PotentialRaisedVoiceToken'
import { startsWith, atLeast, ANY_WHITESPACE, NON_WHITESPACE_CHAR } from '../Patterns'

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

const LINK_URL_START_PATTERN = new RegExp(
  startsWith(ANY_WHITESPACE + '->' + ANY_WHITESPACE)
)

const LINK_END_PATTERN = new RegExp(
  startsWith(escapeForRegex(']'))
)

class Tokenizer {
  public tokens: Token[] = []

  private textIndex = 0

  // These three fields are computer based on `textIndex`.
  private currentChar: string
  private remainingText: string
  private isTouchingWordEnd: boolean

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

  // These conventions don't produce any distinct syntax nodes, and they don't need to be closed. Their
  // purpose is to ensure that any conventions whose delimiters contain parentheses or square brackets
  // can contain parenthesized or "square bracketed" text.
  private parenthesizedConvention: TokenizableSandwich
  private squareBracketedConvention: TokenizableSandwich

  constructor(private entireText: string, private config: UpConfig) {
    this.inlineCodeConvention = new TokenizableSandwich({
      state: TokenizerState.InlineCode,
      startPattern: '`',
      endPattern: '`',
      onOpen: () => {
        this.flushUnmatchedTextToPlainTextToken()
      },
      onClose: () => {
        this.tokens.push(new InlineCodeToken(this.flushUnmatchedText()))
      }
    })

    this.footnoteConvention =
      this.getTypicalSandwichConvention({
        state: TokenizerState.Spoiler,
        startPattern: ANY_WHITESPACE + escapeForRegex('(('),
        endPattern: escapeForRegex('))'),
        StartTokenType: FootnoteStartToken,
        EndTokenType: FootnoteEndToken
      })

    this.spoilerConvention =
      this.getTypicalSandwichConvention({
        state: TokenizerState.Spoiler,
        startPattern: escapeForRegex('[' + this.config.settings.i18n.terms.spoiler + ':') + ANY_WHITESPACE,
        endPattern: escapeForRegex(']'),
        StartTokenType: SpoilerStartToken,
        EndTokenType: SpoilerEndToken
      })

    this.parenthesizedConvention =
      this.getBracketedConvention(TokenizerState.Parenthesized, '(', ')')

    this.squareBracketedConvention =
      this.getBracketedConvention(TokenizerState.Parenthesized, '[', ']')

    this.dirty()
    this.tokenize()
  }

  private tokenize(): void {
    while (true) {

      if (this.failed()) {
        this.undoLatestFallibleContext()
      }

      if (this.reachedEndOfText()) {
        break
      }

      const ESCAPE_CHAR = '\\'

      if (this.currentChar === ESCAPE_CHAR) {
        this.advance(1)
        this.collectCurrentChar()
        continue
      }

      if (this.innermostStateIs(TokenizerState.InlineCode)) {
        if (!this.closeSandwich(this.inlineCodeConvention)) {
          this.collectCurrentChar()
        }

        continue
      }

      if (this.closeBracketsIfTheyAreInnermost()) {
        continue
      }

      if (this.innermostStateIs(TokenizerState.LinkUrl)) {
        if (this.closeLink()) {
          continue
        }

        if (!this.openBracketedText()) {
          this.collectCurrentChar()
        }

        continue
      }

      const didSomething = (
        this.tokenizeRaisedVoicePlaceholders()
        || this.openSandwich(this.inlineCodeConvention)
        || this.closeSandwich(this.spoilerConvention)
        || this.openSandwich(this.spoilerConvention)
        || this.closeSandwich(this.footnoteConvention)
        || this.openSandwich(this.footnoteConvention)
        || this.openLink()
        || (this.hasState(TokenizerState.Link) && (this.openLinkUrl() || this.undoPrematurelyClosedLink()))
        || this.openBracketedText()
      )

      if (didSomething) {
        continue
      }

      this.collectCurrentChar()
    }

    this.flushUnmatchedTextToPlainTextToken()
  }

  private reachedEndOfText(): boolean {
    return !this.remainingText
  }

  private failed(): boolean {
    return (
      this.reachedEndOfText()
      && this.openContexts.some(context => context instanceof FallibleTokenizerContext)
    )
  }

  private undoLatestFallibleContext(args?: { where: (context: FallibleTokenizerContext) => boolean }): void {
    while (this.openContexts.length) {
      const context = this.openContexts.pop()

      if (context instanceof FallibleTokenizerContext && (!args || args.where(context))) {
        this.failedStateTracker.registerFailure(context)

        this.textIndex = context.textIndex
        this.tokens.splice(context.countTokens)
        this.plainTextBuffer = context.plainTextBuffer

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
      this.tokens.push(new PlainTextToken(unmatchedText))
    }
  }

  private canTry(state: TokenizerState): boolean {
    return !this.failedStateTracker.hasFailed(state, this.textIndex)
  }

  private openLink(): boolean {
    return this.openFallibleConvention({
      state: TokenizerState.Link,
      startPattern: LINK_START_PATTERN,
      onOpen: () => {
        this.addTokenAfterFlushingUnmatchedTextToPlainTextToken(new LinkStartToken())
      }
    })
  }

  private openLinkUrl(): boolean {
    return this.openFallibleConvention({
      state: TokenizerState.LinkUrl,
      startPattern: LINK_URL_START_PATTERN,
      onOpen: () => {
        this.flushUnmatchedTextToPlainTextToken()
      }
    })
  }

  private closeLink(): boolean {
    return this.advanceAfterMatch({
      pattern: LINK_END_PATTERN,
      then: () => {
        const url = this.flushUnmatchedText()
        this.tokens.push(new LinkEndToken(url))
        this.closeMostRecentOpen(TokenizerState.LinkUrl)
        this.closeMostRecentOpen(TokenizerState.Link)
      }
    })
  }

  private undoPrematurelyClosedLink(): boolean {
    if (this.advanceAfterMatch({ pattern: LINK_END_PATTERN })) {
      this.undoLatestFallibleContext({
        where: (context) => context.state === TokenizerState.Link
      })

      return true
    }

    return false
  }

  private openSandwich(sandwich: TokenizableSandwich): boolean {
    return this.openFallibleConvention({
      state: sandwich.state,
      startPattern: sandwich.startPattern,
      onOpen: sandwich.onOpen
    })
  }

  private closeSandwich(sandwich: TokenizableSandwich): boolean {
    const { state, endPattern, onClose } = sandwich

    return this.hasState(state) && this.advanceAfterMatch({
      pattern: endPattern,
      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        this.closeMostRecentOpen(state)
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

  private openFallibleConvention(
    args: {
      state: TokenizerState,
      startPattern: RegExp,
      onOpen: OnTokenizerMatch
    }
  ): boolean {
    const { state, startPattern, onOpen } = args

    return this.canTry(state) && this.advanceAfterMatch({
      pattern: startPattern,
      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        this.openContext(state)
        onOpen(match, isTouchingWordEnd, isTouchingWordStart, ...captures)
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

  private closeMostRecentOpen(state: TokenizerState): void {
    for (let i = 0; i < this.openContexts.length; i++) {
      if (this.openContexts[i].state === state) {
        this.openContexts.splice(i, 1)
        return
      }
    }

    throw new Error(`State was not open: ${TokenizerState[state]}`)
  }

  private openContext(nextState: TokenizerState): void {
    this.openContexts.push(
      new FallibleTokenizerContext(nextState, this.textIndex, this.tokens.length, this.plainTextBuffer))
  }

  private addTokenAfterFlushingUnmatchedTextToPlainTextToken(token: Token): void {
    this.flushUnmatchedTextToPlainTextToken()
    this.tokens.push(token)
  }

  private hasState(state: TokenizerState): boolean {
    return this.openContexts.some(context => context.state === state)
  }

  private innermostStateIs(state: TokenizerState): boolean {
    const innermostState = last(this.openContexts)
    return (innermostState && innermostState.state === state)
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
      onClose: addBracketToBuffer
    })
  }

  private getTypicalSandwichConvention(
    args: {
      state: TokenizerState,
      startPattern: string,
      endPattern: string,
      StartTokenType: TokenType,
      EndTokenType: TokenType
    }
  ): TokenizableSandwich {
    return new TokenizableSandwich({
      state: args.state,
      startPattern: args.startPattern,
      endPattern: args.endPattern,
      onOpen: () => {
        this.addTokenAfterFlushingUnmatchedTextToPlainTextToken(new args.StartTokenType())
      },
      onClose: () => {
        this.addTokenAfterFlushingUnmatchedTextToPlainTextToken(new args.EndTokenType())
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
