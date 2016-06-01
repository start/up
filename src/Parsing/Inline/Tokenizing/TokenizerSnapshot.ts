import { TokenizerGoal } from './TokenizerGoal'
import { TokenizerContext } from './TokenizerContext'
import { Token } from './Tokens/Token'

export class TokenizerSnapshot {
  textIndex: number
  tokens: Token[]
  openContexts: TokenizerContext[]
  bufferedText: string

  constructor(
    args: {
      countCharsConsumed: number
      tokens: Token[]
      openContexts: TokenizerContext[]
      buffer: string
    }
  ) {
    this.textIndex = args.countCharsConsumed
    this.tokens = args.tokens.slice()
    this.openContexts = args.openContexts.slice()
    this.bufferedText = args.buffer
  }
}
