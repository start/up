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
import { ContextualizedToken } from './TokenContextualization/ContextualizedToken'
import { ContextualizedStartToken } from './TokenContextualization/ContextualizedStartToken'
import { ContextualizedEndToken } from './TokenContextualization/ContextualizedEndToken'


// TODO: Dramatically naming


export function tokenize(text: string, config: UpConfig): Token[] {
  return new Tokenizer(text, config)
    .tokens
    .map(token => token.rawToken)
}


class Bracket {
  constructor(
    public open: string,
    public close: string) { }
}


class TypicalRichConvention {
  startPattern: RegExp
  endPattern: RegExp
  
  constructor(public convention: RichConvention, startPattern: string, endPattern: string) {
    this.startPattern = new RegExp(startsWith(startPattern))
    this.endPattern = new RegExp(startsWith(endPattern))
   }
}


const RICH_PARENTHESES =
  new TypicalRichConvention(
    PARENTHESIZED,
    escapeForRegex('('),
    escapeForRegex(')'))

class Tokenizer {
  tokens: ContextualizedToken[] = []

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
      || this.tryToOpenTypicalRichConvention(RICH_PARENTHESES)
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
      && this.closeTypicalRichConvention({ context, richConvention: RICH_PARENTHESES })
    )
  }

  private tryToOpenTypicalRichConvention(richConvention: TypicalRichConvention): boolean {
    return this.consumer.advanceAfterMatch({
      pattern: richConvention.endPattern,
      then: () => {
        this.openContexts.push(
          new Context(richConvention.convention.goal, this.getCurrentSnapshot()))
      }
    })
  }

  private closeTypicalRichConvention(
    args: {
      context: Context
      richConvention: TypicalRichConvention
    }): boolean {
    const { context, richConvention } = args

    return this.consumer.advanceAfterMatch({
      pattern: richConvention.endPattern,
      then: () => {
        const rawStartToken = new richConvention.convention.StartTokenType()
        const rawEndToken = new richConvention.convention.EndTokenType()
        
        const startToken = new ContextualizedStartToken(rawStartToken, richConvention.convention)
        const endToken = new ContextualizedEndToken(rawEndToken, richConvention.convention)
        
        associate(startToken, endToken)
         
        this.insertToken({
          token: startToken,
          atIndex: context.startIndex,
          contextForToken: context
        })

        this.addToken(endToken)

        remove(this.openContexts, context)
      }
    })
  }

  private insertToken(args: {
    token: ContextualizedToken
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

  private addToken(token: ContextualizedToken): void {
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
      this.addToken(new ContextualizedToken(new PlainTextToken(buffer)))
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

function associate(start: ContextualizedStartToken, end: ContextualizedEndToken): void {
  start.end = end
  end.start = start
}