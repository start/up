import { TokenizerGoal } from './TokenizerGoal'
import { TokenizerSnapshot } from './TokenizerSnapshot'

export class TokenizerContext {
  private _initialTokenIndex: number
  
  constructor(public goal: TokenizerGoal, public snapshot: TokenizerSnapshot) {
    this._initialTokenIndex = snapshot.tokens.length
  }
  
  get initialTokenIndex(): number {
    return this._initialTokenIndex
  }
}
