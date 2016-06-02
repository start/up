import { TokenizerGoal } from './TokenizerGoal'
import { TokenizerContext } from './TokenizerContext'
import { ContextualizedToken } from './TokenContextualization/ContextualizedToken'

export class TokenizerSnapshot {
  textIndex: number
  tokens: ContextualizedToken[]
  openContexts: TokenizerContext[]
  bufferedText: string

  constructor(
    args: {
      countCharsConsumed: number
      tokens: ContextualizedToken[]
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
