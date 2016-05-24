import { TokenizerGoal } from './TokenizerGoal'
import { TokenizerBehavior } from './TokenizerBehavior'


export interface TokenizerContext {
  goal: TokenizerGoal
  textIndex: number
  countTokens: number
  openContexts: TokenizerContext[]
  plainTextBuffer: string
}
