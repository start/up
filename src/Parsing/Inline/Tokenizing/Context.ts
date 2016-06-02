import { TokenizerGoal } from './TokenizerGoal'
import { TokenizerSnapshot } from './TokenizerSnapshot'

export class Context {
  public startIndex: number

  constructor(
    public goal: TokenizerGoal,
    public snapshot: TokenizerSnapshot
  ) {
    this.reset()
  }
  
  notifyOfTokenInsertion(indexOfNewToken: number): void {
    if (indexOfNewToken >= this.startIndex) {
      this.startIndex += 1
    }
  }
  
  reset(): void {
    this.startIndex = this.snapshot.tokens.length
  }
}