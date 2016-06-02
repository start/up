import { TokenizerGoal } from './TokenizerGoal'
import { TokenizerSnapshot } from './TokenizerSnapshot'

export class TokenizerContext {
  public initialTokenIndex: number

  constructor(public goal: TokenizerGoal, public snapshot: TokenizerSnapshot) {
    this.reset()
  }

  registerTokenInsertion(args: { atIndex: number }) {
    if (this.initialTokenIndex >= args.atIndex) {
      this.initialTokenIndex += 1
    }
  }

  reset(): void {
    this.initialTokenIndex = this.snapshot.tokens.length
  }
}
