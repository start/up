import { TokenizerGoal } from './TokenizerGoal'
import { TokenizerContext } from './TokenizerContext'


export class TokenizerSnapshot {
  textIndex: number
  countTokens: number
  openContexts: TokenizerContext[]
  bufferedText: string

  constructor(
    args: {
      textIndex: number
      countTokens: number
      openContexts: TokenizerContext[]
      bufferedText: string
    }
  ) {
    this.textIndex = args.textIndex
    this.countTokens = args.countTokens
    this.openContexts = args.openContexts
    this.bufferedText = args.bufferedText
  }
}