import { TokenizerGoal } from './TokenizerGoal'
import { TokenizerSnapshot } from './TokenizerSnapshot'

export class TokenizerContext {
  initialTokenIndex: number
  goal: TokenizerGoal
  snapshot: TokenizerSnapshot
  endPattern: RegExp
  consumeEndPattern = true

  constructor(
    args: {
      goal: TokenizerGoal
      snapshot: TokenizerSnapshot
    }
  ) {
    this.goal = args.goal
    this.snapshot = args.snapshot
    this.initialTokenIndex = args.snapshot.textIndex
    
    this.reset()
  }

  registerTokenInsertion(args: { atIndex: number, onBehalfOfContext: TokenizerContext }) {
    const { atIndex, onBehalfOfContext } = args

    // Should we increment our initial index?
    const mustIncrementInitialIndex = (
      
      // Well, if the token was inserted before our intial index, we certianly do.
      atIndex < this.initialTokenIndex

      || (
        // But what if the token was inserted *at* our initial index?
        atIndex === this.initialTokenIndex

        // In that case, we'll only update our initial index if the token is being inserted on behalf
        // of a context that was opened before this one.
        && onBehalfOfContext.snapshot.textIndex < this.snapshot.textIndex
      )
    )

    if (mustIncrementInitialIndex) {
      this.initialTokenIndex += 1
    }
  }

  reset(): void {
    this.initialTokenIndex = this.snapshot.tokens.length
  }
}
