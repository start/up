import { TokenizerState } from './TokenizerState'
import { TokenizerBehavior } from './TokenizerBehavior'


export interface TokenizerContext {
  state: TokenizerState
  textIndex: number
  countTokens: number
  openContexts: TokenizerContext[]
  plainTextBuffer: string
}
