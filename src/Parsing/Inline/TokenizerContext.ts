import { TokenizerState } from './TokenizerState'


export interface TokenizerContext {
  state: TokenizerState
  textIndex: number
  countTokens: number
  openContexts: TokenizerContext[]
  plainTextBuffer: string
}
