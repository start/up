import { TokenizerGoal } from './TokenizerGoal'
import { TokenizerSnapshot } from './TokenizerSnapshot'

export class Context {
  private initialTokenIndex: number

  constructor(
    public goal: TokenizerGoal,
    public snapshot: TokenizerSnapshot
  ) {
    this.reset()
  }
  
  notifyOfTokenInsertion(indexOfNewToken: number): void {
    if (indexOfNewToken >= this.initialTokenIndex) {
      this.initialTokenIndex += 1
    }
  }
  
  reset(): void {
    this.initialTokenIndex = this.snapshot.tokens.length
  }
}