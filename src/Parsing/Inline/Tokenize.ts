import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { TokenizerResult } from './TokenizerResult'
import { TokenizerState } from './TokenizerState'
import { FailedStateTracker } from './FailedStateTracker'
import { OldTokenizerContext, TokenizerContext } from './TokenizerContext'
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

class Tokenizer {
  public tokens: Token[] = []

  private textIndex = 0

  private currentChar: string
  private remainingText: string
  private isTouchingWordEnd: boolean

  private unresolvedContexts: TokenizerContext[] = []

  private failedStateTracker: FailedStateTracker = new FailedStateTracker()
  // The tokenizer collects text that doesn't match any conventions' delimiters. Eventually, this text is flushed
  // to a token.
  //
  // Usually, this non-matching text is flushed to a PlainTextToken, but it can also be flushed to other kinds of
  // tokens (like InlineCodeTokens).
  private collectedUnmatchedText = ''

  private inlineCodeConvention: TokenizableConvention
  private footnoteConvention: TokenizableConvention
  private spoilerConvention: TokenizableConvention

  constructor(private entireText: string, private config: UpConfig) {
    this.inlineCodeConvention = new TokenizableConvention({
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

    this.footnoteConvention = new TokenizableConvention({
      state: TokenizerState.Footnote,
      startPattern: ANY_WHITESPACE + escapeForRegex('(('),
      endPattern: escapeForRegex('))'),
      onOpen: () => {
        this.addTokenAfterFlushingUnmatchedTextToPlainTextToken(new FootnoteStartToken())
      },
      onClose: () => {
        this.addTokenAfterFlushingUnmatchedTextToPlainTextToken(new FootnoteEndToken())
      }
    })

    this.spoilerConvention = new TokenizableConvention({
      state: TokenizerState.Spoiler,
      startPattern: escapeForRegex('[' + this.config.settings.i18n.terms.spoiler + ':') + ANY_WHITESPACE,
      endPattern: escapeForRegex(']'),
      onOpen: () => {
        this.addTokenAfterFlushingUnmatchedTextToPlainTextToken(new SpoilerStartToken())
      },
      onClose: () => {
        this.addTokenAfterFlushingUnmatchedTextToPlainTextToken(new SpoilerEndToken())
      }
    })

    this.dirty()
    this.tokenize()
  }

  private tokenize(): void {
    while (true) {
      if (this.done()) {
        if (!this.hasUnresolvedConventions()) {
          break
        }

        this.backtrackLatestFailedConvention()
      }

      if (this.currentChar === '\\') {
        this.advance(1)
        this.collectCurrentChar()
        continue
      }

      if (this.hasState(TokenizerState.InlineCode)) {
        if (!this.closeConvention(this.inlineCodeConvention)) {
          this.collectCurrentChar()
        }

        continue
      }

      const tokenizedSomething = (
        this.tokenizeRaisedVoicePlaceholders()
        || this.openConvention(this.inlineCodeConvention)
        || this.closeConvention(this.footnoteConvention)
        || this.closeConvention(this.spoilerConvention)
        || this.openConvention(this.footnoteConvention)
        || this.openConvention(this.spoilerConvention)
      )

      if (tokenizedSomething) {
        continue
      }

      this.collectCurrentChar()
    }

    this.flushUnmatchedTextToPlainTextToken()
  }

  private done(): boolean {
    return !this.remainingText
  }

  private hasUnresolvedConventions(): boolean {
    return !!this.unresolvedContexts.length
  }

  private backtrackLatestFailedConvention(): void {
    const latestUnresolvedContext = this.unresolvedContexts.pop()

    this.failedStateTracker.registerFailure(latestUnresolvedContext)

    this.textIndex = latestUnresolvedContext.textIndex
    this.tokens.splice(latestUnresolvedContext.countTokens)
    this.collectedUnmatchedText = latestUnresolvedContext.collectedUnmatchedText

    this.dirty()
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

  private canTry(state: TokenizerState): boolean {
    return !this.failedStateTracker.hasFailed(state, this.textIndex)
  }

  private openConvention(convention: TokenizableConvention): boolean {
    const { state, startPattern, onOpen } = convention

    return this.canTry(state) && this.advanceAfterMatch({
      pattern: startPattern,
      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        this.addUnresolvedContext(state)
        onOpen(match, isTouchingWordEnd, isTouchingWordStart, ...captures)
      }
    })
  }

  private closeConvention(convention: TokenizableConvention): boolean {
    const { state, endPattern, onClose } = convention

    return this.hasState(state) && this.advanceAfterMatch({
      pattern: endPattern,
      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        this.resolveMostRecentUnresolved(state)
        onClose(match, isTouchingWordEnd, isTouchingWordStart, ...captures)
      }
    })
  }

  private resolveMostRecentUnresolved(state: TokenizerState): void {
    for (let i = 0; i < this.unresolvedContexts.length; i++) {
      if (this.unresolvedContexts[i].state === state) {
        this.unresolvedContexts.splice(i, 1)
        return
      }
    }

    throw new Error(`State was not unresolved: ${TokenizerState[state]}`)
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


interface TokenizableConventionArgs {
  state: TokenizerState,
  startPattern: string,
  endPattern: string,
  onOpen: OnMatch,
  onClose: OnMatch
}

class TokenizableConvention {
  public state: TokenizerState
  public startPattern: RegExp
  public endPattern: RegExp
  public onOpen: OnMatch
  public onClose: OnMatch

  constructor(args: TokenizableConventionArgs) {
    this.state = args.state
    this.startPattern = new RegExp(startsWith(args.startPattern), 'i')
    this.endPattern = new RegExp(startsWith(args.endPattern), 'i')
    this.onOpen = args.onOpen
    this.onClose = args.onClose
  }
}

interface MatchArgs {
  pattern: RegExp,
  then?: OnMatch
}

interface OpenConventionArgs {
  stateToOpen: TokenizerState,
  startPattern: RegExp,
  then: OnMatch
}

interface CloseConventionArgs {
  stateToClose: TokenizerState,
  endPattern: RegExp,
  then: OnMatch
}

interface OnMatch {
  (match: string, isTouchingWordEnd: boolean, isTouchingWordStart: boolean, ...captures: string[]): void
}
