import { TokenizerGoal } from './TokenizerGoal'
import { TokenizerContext } from './TokenizerContext'
import { Token } from './Tokens/Token'

export class TokenizerSnapshot {
  countCharsConsumed: number
  tokens: Token[]
  openContexts: TokenizerContext[]
  bufferedText: string

  constructor(
    args: {
      countCharsConsumed: number
      tokens: Token[]
      openContexts: TokenizerContext[]
      bufferedText: string
    }
  ) {
    this.countCharsConsumed = args.countCharsConsumed
    this.tokens = args.tokens.slice()
    this.openContexts = args.openContexts.slice()
    this.bufferedText = args.bufferedText
  }
}
