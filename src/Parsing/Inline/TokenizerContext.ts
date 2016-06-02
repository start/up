import { TokenizerGoal } from './TokenizerGoal'
import { TokenizerSnapshot } from './TokenizerSnapshot'

export interface TokenizerContext {
  goal: TokenizerGoal
  snapshot: TokenizerSnapshot
}
