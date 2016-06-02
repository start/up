import { escapeForRegex, startsWith, optional, atLeast, ANY_WHITESPACE, WHITESPACE_CHAR, NON_WHITESPACE_CHAR, OPEN_PAREN, CLOSE_PAREN, OPEN_SQUARE_BRACKET, CLOSE_SQUARE_BRACKET, OPEN_CURLY_BRACKET, CLOSE_CURLY_BRACKET } from '../../../Patterns'
import { REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE, LINK, PARENTHESIZED, SQUARE_BRACKETED, ACTION } from './RichConventions'
import { AUDIO, IMAGE, VIDEO } from './MediaConventions'
import { UpConfig } from '../../../UpConfig'
import { RichConvention } from './RichConvention'
import { MediaConvention } from './MediaConvention'
import { InlineConsumer } from './InlineConsumer'
import { applyRaisedVoices }  from './RaisedVoices/applyRaisedVoices'
import { nestOverlappingConventions } from './nestOverlappingConventions'
import { OnTokenizerMatch } from './OnTokenizerMatch'
import { last, remove } from '../../../CollectionHelpers'
import { MediaDescriptionToken } from './Tokens/MediaDescriptionToken'
import { MediaEndToken } from './Tokens/MediaEndToken'
import { TokenizerGoal } from './TokenizerGoal'
import { TokenizableSandwich } from './TokenizableSandwich'
import { TokenizableMedia } from './TokenizableMedia'
import { FailedGoalTracker } from './FailedGoalTracker'
import { Context } from './Context'
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
import { ParenthesizedStartToken } from './Tokens/ParenthesizedStartToken'
import { ParenthesizedEndToken } from './Tokens/ParenthesizedEndToken'


export function tokenize(text: string, config: UpConfig): Token[] {
  return new Tokenizer(text, config).tokens
}


class Bracket {
  constructor(
    public open: string,
    public close: string) { }
}


const PARENS = new Bracket('(', ')')
const SQUARE_BRACKETS = new Bracket('[', ']')
const CURLY_BRACKETS = new Bracket('{', '}')


class TypicalRichConvention {
  constructor(
    public startPattern: RegExp,
    public endPattern: RegExp,
    public StartTokenType: TokenType,
    public EndTokenType: TokenType) { }
}


function toTypicalRichConvention(
  bracket: Bracket,
  startTokenType: TokenType,
  endTokenType: TokenType
): TypicalRichConvention {
  return new TypicalRichConvention(
    new RegExp(escapeForRegex(bracket.open)),
    new RegExp(escapeForRegex(bracket.close)),
    startTokenType,
    endTokenType)
}

const RICH_PARENS = toTypicalRichConvention(PARENS, ParenthesizedStartToken, ParenthesizedEndToken)

class Tokenizer {
  tokens: Token[] = []

  private consumer: InlineConsumer

  // We use this to help us with backtracking
  private failedGoalTracker: FailedGoalTracker = new FailedGoalTracker()

  // This buffer is for any text that isn't consumed by special delimiters. Eventually, the buffer gets
  // flushed to a token, asually a PlainTextToken.
  private buffer = ''

  private openContexts: Context[] = []

  constructor(private entireText: string, config: UpConfig) {
    this.consumer = new InlineConsumer(entireText)
    this.configureConventions(config)
    this.tokenize()
  }

  private configureConventions(config: UpConfig): void {

  }

  private tokenize(): void {
    while (!this.consumer.done()) {
      this.tryToBufferEscapedChar()
        || this.bufferCurrentChar()
    }

    this.flushBufferToPlainTextToken()

    this.tokens = nestOverlappingConventions(this.tokens)
  }

  private tryToBufferEscapedChar(): boolean {
    const ESCAPE_CHAR = '\\'

    if (this.consumer.currentChar !== ESCAPE_CHAR) {
      return false
    }

    this.consumer.advanceTextIndex(1)

    return (
      this.consumer.done()
      || this.tryToCloseOpenContexts()
      || this.bufferCurrentChar()
    )
  }

  private tryToCloseOpenContexts(): boolean {
    for (let i = this.openContexts.length - 1; i >= 0; i--) {
      if (this.tryToCloseContext(this.openContexts[i])) {
        return true
      }
    }

    return false
  }

  private tryToCloseContext(context: Context): boolean {
    return (
      context.goal === TokenizerGoal.RichParentheses
      && this.closeTypicalRichConvention({ context, convention: RICH_PARENS })
    )
  }

  private closeTypicalRichConvention(
    args: {
      context: Context
      convention: TypicalRichConvention
    }): boolean {
    const { context, convention } = args

    return this.consumer.advanceAfterMatch({
      pattern: convention.endPattern,
      then: () => {
        this.insertToken({
          token: new convention.StartTokenType,
          atIndex: context.startIndex,
          contextForToken: args.context
        })
        
        this.addToken(new convention.EndTokenType)

        remove(this.openContexts, args.context)
      }
    })
  }

  private insertToken(args: {
    token: Token
    atIndex: number
    contextForToken: Context
  }) {
    const { token, atIndex, contextForToken } = args

    this.tokens.splice(atIndex, 0, args.token)

    for (const context of this.openContexts) {
      if (contextForToken != context) {
        context.notifyOfTokenInsertion(atIndex)
      }
    }
  }

  private addToken(token: Token): void {
    this.tokens.push(token)
  }

  // This method always returns true, which allows us to use some cleaner boolean logic.
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
    const buffer = this.flushBuffer()

    if (buffer) {
      this.addToken(new PlainTextToken(buffer))
    }
  }

  private getCurrentSnapshot(): TokenizerSnapshot {
    return new TokenizerSnapshot({
      countCharsConsumed: this.consumer.countCharsConsumed,
      tokens: this.tokens,
      openContexts: this.openContexts,
      buffer: this.buffer
    })
  }

  private canTry(goal: TokenizerGoal, atIndex = this.consumer.countCharsConsumed): boolean {
    return !this.failedGoalTracker.hasFailed(goal, atIndex)
  }
}

const CLOSE_PAREN_PATTERN = new RegExp(
  CLOSE_PAREN
)