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
      textIndex: number
      tokens: Token[]
      openContexts: TokenizerContext[]
      bufferedText: string
    }
  ) {
    this.textIndex = args.textIndex
    this.tokens = args.tokens.slice()
    this.openContexts = args.openContexts.slice()
    this.bufferedText = args.bufferedText
  }
}
