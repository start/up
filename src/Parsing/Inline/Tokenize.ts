import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { TokenizerResult } from './TokenizerResult'
import { TokenizerState } from './TokenizerState'
import { OldTokenizerContext, TokenizerContext } from './TokenizerContext'
import { RichConvention } from './RichConvention'
import { last, lastChar, swap } from '../CollectionHelpers'
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
import { startsWith, NON_WHITESPACE_CHAR } from '../Patterns'

export function tokenize(text: string, config: UpConfig): Token[] {
  const tokens = new Tokenizer(text, config).tokens

  const tokensWithRaisedVoicesApplied =
    applyRaisedVoicesToRawTokens(tokens)

  return massageTokensIntoTreeStructure(tokensWithRaisedVoicesApplied)
}


const NON_WHITESPACE_CHAR_PATTERN = new RegExp(
  NON_WHITESPACE_CHAR
)

const INLINE_CODE_DELIMITER_PATTERN = new RegExp(
  startsWith('`')
)


class Tokenizer {
  public tokens: Token[] = []

  private textIndex = 0

  private currentChar: string
  private remainingText: string
  private isTouchingWordEnd: boolean

  private unresolvedContexts: TokenizerContext[] = []

  // The tokenizer collects text that doesn't match any conventions' delimiters. Eventually, this text is flushed
  // to a token.
  //
  // Usually, this non-matching text is flushed to a PlainTextToken, but it can also be flushed to other kinds of
  // tokens (like InlineCodeTokens).
  private collectedUnmatchedText = ''

  constructor(private entireText: string, private config: UpConfig) {
    this.dirty()

    while (!this.done()) {
      if (this.currentChar === '\\') {
        this.advance(1)
        this.collectCurrentChar()
        continue
      }

      if (this.hasState(TokenizerState.InlineCode)) {
        if (!this.closeInlineCode()) {
          this.collectCurrentChar()
        }

        continue
      }

      if (this.openInlineCode()) {
        continue
      }

      this.collectCurrentChar()
    }

    this.flushUnmatchedTextToPlainTextToken()
  }

  private done(): boolean {
    return !this.remainingText
  }

  private advance(length: number): void {
    this.textIndex += length
    this.dirty()
  }

  private collectCurrentChar(): void {
    this.collectedUnmatchedText += this.currentChar
    this.advance(1)
  }

  private flushUnmatchedText(): string {
    const unmatchedText = this.collectedUnmatchedText
    this.collectedUnmatchedText = ''

    return unmatchedText
  }

  private flushUnmatchedTextToPlainTextToken(): void {
    const unmatchedText = this.flushUnmatchedText()

    if (unmatchedText) {
      this.tokens.push(new PlainTextToken(unmatchedText))
    }
  }

  private openInlineCode(): boolean {
    return this.advanceAfterMatch({
      pattern: INLINE_CODE_DELIMITER_PATTERN,
      then: () => {
        this.addUnresolvedContext(TokenizerState.InlineCode)
        this.flushUnmatchedTextToPlainTextToken()
      }
    })
  }

  private closeInlineCode(): boolean {
    return this.advanceAfterMatch({
      pattern: INLINE_CODE_DELIMITER_PATTERN,
      then: () => {
        this.unresolvedContexts.pop()
        this.tokens.push(new InlineCodeToken(this.flushUnmatchedText()))
      }
    })
  }

  private addUnresolvedContext(nextState: TokenizerState): void {
    this.unresolvedContexts.push(
      new TokenizerContext(nextState, this.textIndex, this.tokens.length, this.collectedUnmatchedText))
  }

  private addTokenAfterFlushingUnmatchedTextToPlainTextToken(token: Token): void {
    this.flushUnmatchedTextToPlainTextToken()
    this.tokens.push(token)
  }

  private hasState(state: TokenizerState): boolean {
    return this.unresolvedContexts.some(context => context.state === state)
  }

  private advanceAfterMatch(args: MatchArgs): boolean {
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
}



interface MatchArgs {
  pattern: RegExp,
  then?: OnMatch
}

interface OnMatch {
  (match: string, isTouchingWordEnd: boolean, isTouchingWordStart: boolean, ...captures: string[]): void
}

// TODO: Refactor tons of duplicate functionality


class OldTokenizer {
  public result: TokenizerResult
  private tokens: Token[] = []

  // The tokenizer collects text that doesn't match any conventions' delimiters. Eventually, this text is flushed
  // to a token.
  //
  // Usually, this non-matching text is flushed to a PlainTextToken, but it can also be flushed to other kinds of
  // tokens (like InlineCodeTokens).
  private collcetedUnmatchedText = ''

  constructor(private context: OldTokenizerContext, private config: UpConfig) {
    if (this.context.initialToken) {
      this.tokens.push(this.context.initialToken)
    }

    while (!this.context.done()) {
      if (this.context.currentChar === '\\') {
        this.context.advance(1)
        this.collectCurrentChar()
        continue
      }

      if (this.context.isInlineCodeOpen) {
        if (this.closeInlineCode()) {
          return
        }
      } else {
        if (this.context.countSpoilersOpen && this.closeSpoiler() && this.context.isSpoilerInnermostOpenConvention()) {
          return
        }

        if (this.context.countFootnotesOpen && this.closeFootnote() && this.context.isFootnoteInnermostOpenConvention()) {
          return
        }

        if (this.context.isRevisionInsertionOpen) {
          if (this.closeRevisionInsertion()) {
            return
          }
        } else {
          // Currently, as a rule, you cannot nest revision insertion inside another revision insertion.
          if (this.tokenizeRevisionInsertion()) {
            continue
          }
        }

        if (this.context.isRevisionDeletionOpen) {
          if (this.closeRevisionDeletion()) {
            return
          }
        } else {
          // Currently, as a rule, you cannot nest revision deletion inside another revision deletion.
          if (this.tokenizeRevisionDeletion()) {
            continue
          }
        }

        const didTokenizeConvention = (
          this.tokenizeInlineCode()
          || this.tokenizeRaisedVoicePlaceholders()
          || this.tokenizeSpoiler()
          || this.tokenizeFootnote()
        )

        if (didTokenizeConvention) {
          continue
        }
      }

      this.collectCurrentChar()
    }

    this.flushUnmatchedTextToPlainTextToken()

    this.result = {
      succeeded: !this.context.failed(),
      lengthAdvanced: this.context.lengthAdvanced,
      tokens: this.tokens
    }
  }

  private collectCurrentChar(): void {
    this.collcetedUnmatchedText += this.context.currentChar
    this.context.advance(1)
  }

  private flushUnmatchedText(): string {
    const unmatchedText = this.collcetedUnmatchedText
    this.collcetedUnmatchedText = ''

    return unmatchedText
  }

  private flushUnmatchedTextToPlainTextToken(): void {
    const unmatchedText = this.flushUnmatchedText()

    if (unmatchedText) {
      this.tokens.push(new PlainTextToken(unmatchedText))
    }
  }

  private flushUnmatchedTextToPlainTextTokenThenAddTokens(...tokens: Token[]): void {
    this.flushUnmatchedTextToPlainTextToken()
    this.tokens.push(...tokens)
  }

  private tokenizeInlineCode(): boolean {
    return this.tokenizeConvention({
      pattern: /^`/,
      getNewContext: () => this.context.withInlineCodeOpen()
    })
  }

  private closeInlineCode(): boolean {
    if (this.context.advanceIfMatch({ pattern: /^`/ })) {
      this.context.closeInlineCode()
      this.result = this.getResultFor(new InlineCodeToken(this.flushUnmatchedText()))
      return true
    }

    return false
  }

  private tokenizeSpoiler(): boolean {
    return this.tokenizeConvention({
      pattern: new RegExp(`^\\[${this.config.settings.i18n.terms.spoiler}:\\s*`, 'i'),
      getNewContext: () => this.context.withAdditionalSpoilerOpen()
    })
  }

  private closeSpoiler(): boolean {
    if (this.context.advanceIfMatch({ pattern: /^\]/ })) {
      this.flushUnmatchedTextToPlainTextTokenThenAddTokens(new SpoilerEndToken())
      this.context.closeSpoiler()
      this.result = this.getResult()
      return true
    }

    return false
  }

  private tokenizeRevisionInsertion(): boolean {
    return this.tokenizeConvention({
      pattern: /^\+\+/,
      getNewContext: () => this.context.withRevisionInsertionOpen()
    })
  }

  private closeRevisionInsertion(): boolean {
    if (this.context.advanceIfMatch({ pattern: /^\+\+/ })) {
      this.flushUnmatchedTextToPlainTextTokenThenAddTokens(new RevisionInsertionEndToken())
      this.context.closeRevisionInsertion()
      this.result = this.getResult()
      return true
    }

    return false
  }

  private tokenizeRevisionDeletion(): boolean {
    return this.tokenizeConvention({
      pattern: /^~~/,
      getNewContext: () => this.context.withRevisionDeletionOpen()
    })
  }

  private closeRevisionDeletion(): boolean {
    if (this.context.advanceIfMatch({ pattern: /^~~/ })) {
      this.flushUnmatchedTextToPlainTextTokenThenAddTokens(new RevisionDeletionEndToken())
      this.context.closeRevisionDeletion()
      this.result = this.getResult()
      return true
    }

    return false
  }

  private tokenizeFootnote(): boolean {
    return this.tokenizeConvention({
      pattern: /^\s*\(\(/,
      getNewContext: () => this.context.withAdditionalFootnoteOpen()
    })
  }

  private closeFootnote(): boolean {
    if (this.context.advanceIfMatch({ pattern: /^\)\)/ })) {
      this.flushUnmatchedTextToPlainTextTokenThenAddTokens(new FootnoteEndToken())
      this.context.closeFootnote()
      this.result = this.getResult()
      return true
    }

    return false
  }

  private tokenizeConvention(args: OpenConventionArgs): boolean {
    let newContext: OldTokenizerContext

    const canOpenPattern = this.context.match({
      pattern: args.pattern,
      then: match => {
        newContext = args.getNewContext()
        newContext.advance(match.length)
      }
    })

    if (!canOpenPattern) {
      return false
    }

    return this.tokenizeRestOfConvention(newContext)
  }

  private tokenizeRestOfConvention(context: OldTokenizerContext): boolean {
    const result = new OldTokenizer(context, this.config).result

    if (!result.succeeded) {
      return false
    }

    this.flushUnmatchedTextToPlainTextTokenThenAddTokens(...result.tokens)
    this.context.advance(result.lengthAdvanced)
    return true
  }

  private getResult(): TokenizerResult {
    return this.getResultFor(...this.tokens)
  }

  private getResultFor(...tokens: Token[]): TokenizerResult {
    return {
      succeeded: true,
      lengthAdvanced: this.context.lengthAdvanced,
      tokens: tokens
    }
  }

  // Handle emphasis and stress conventions
  private tokenizeRaisedVoicePlaceholders(): boolean {
    const ASTERISKS_PATTERN = /^\*+/

    return this.context.advanceIfMatch({
      pattern: ASTERISKS_PATTERN,

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

        this.flushUnmatchedTextToPlainTextTokenThenAddTokens(new AsteriskTokenType(asterisks))
      }
    })
  }
}

interface OpenConventionArgs {
  pattern: RegExp,
  getNewContext: () => OldTokenizerContext
}