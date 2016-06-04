import { TokenizerGoal } from './TokenizerGoal'
import { TokenizerSnapshot } from './TokenizerSnapshot'

export class TokenizerContext {
  public initialTokenIndex: number

  constructor(public goal: TokenizerGoal, public snapshot: TokenizerSnapshot) {
    this.reset()
  }

  registerTokenInsertion(args: { atIndex: number, forContext?: TokenizerContext }) {
    const { atIndex, forContext } = args
    
    if (this === forContext) {
      return
    }
    
    // We don't adjust our initial token index if the token was inserted at that same index. Why not?
    //
    // Considering this context is still waiting to be closed, the inserted token belongs to a convention
    // that is inside this one (if the conventions were overlapping, the other token wouldn't be inserted
    // at the same index; it would be inserted before).
    //
    // Because the other convention is inside this the one represented by this context, this context's
    // initial index should remain before the index of the other token. 
    if (args.atIndex < this.initialTokenIndex) {
      this.initialTokenIndex += 1
    }
  }

  reset(): void {
    this.initialTokenIndex = this.snapshot.tokens.length
  }
}
