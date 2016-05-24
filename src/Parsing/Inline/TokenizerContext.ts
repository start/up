import { TokenizerGoal } from './TokenizerGoal'


export interface TokenizerContext {
  goal: TokenizerGoal
  textIndex: number
  countTokens: number
  openContexts: TokenizerContext[]
  plainTextBuffer: string
}
