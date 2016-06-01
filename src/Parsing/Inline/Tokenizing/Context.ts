import { TokenizerGoal } from './TokenizerGoal'
import { TokenizerSnapshot } from './TokenizerSnapshot'

export interface Context {
  openPattern: RegExp
  closePattern: RegExp
  goal: TokenizerGoal
  snapshot: TokenizerSnapshot
}