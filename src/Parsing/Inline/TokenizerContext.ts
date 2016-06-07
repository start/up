import { TokenizableConvention } from './TokenizableConvention'
import { TokenizerSnapshot } from './TokenizerSnapshot'

export class TokenizerContext {
  initialTokenIndex: number

  constructor(public convention: TokenizableConvention, public snapshot: TokenizerSnapshot) {
    this.initialTokenIndex = snapshot.textIndex
    this.snapshot = snapshot
    
    this.reset()
  }

  doIsteadOfTryingToCloseOuterContexts(): boolean {
    if (this.convention.insteadOfTryingToCloseOuterContexts) {
      this.convention.insteadOfTryingToCloseOuterContexts()
      return true
    }

    return false
  }

  doInsteadOfTryingToOpenUsualContexts(): boolean {
    if (this.convention.insteadOfTryingToOpenUsualConventions) {
      this.convention.insteadOfTryingToOpenUsualConventions()
      return true
    }

    return false
  }

  close(): void {
    if (this.convention.onClose) {
      this.convention.onClose(this)
    }
  }

  resolveWhenLeftUnclosed(): boolean {
    if (this.convention.resolveWhenLeftUnclosed) {
      this.convention.resolveWhenLeftUnclosed(this)
      return true
    }

    return false
  }

  registerTokenInsertion(args: { atIndex: number, onBehalfOfContext: TokenizerContext }) {
    const { atIndex, onBehalfOfContext } = args

    // Do we need to increment our initial index?
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