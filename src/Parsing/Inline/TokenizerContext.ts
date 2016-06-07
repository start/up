import { TokenizerGoal } from './TokenizerGoal'
import { TokenizableConvention } from './TokenizableConvention'
import { TokenizerSnapshot } from './TokenizerSnapshot'

export class TokenizerContext {
  initialTokenIndex: number

  constructor(public convention: TokenizableConvention, public snapshot: TokenizerSnapshot) {
    this.initialTokenIndex = snapshot.textIndex
    this.snapshot = snapshot
    
    this.reset()
  }

  doBeforeTryingToCloseOuterContexts(): boolean {
    if (this.convention.beforeTryingToCloseOuterContexts) {
      return this.convention.beforeTryingToCloseOuterContexts()
    }

    return false
  }

  doAfterTryingToCloseOuterContexts(): boolean {
    if (this.convention.afterTryingToCloseOuterContexts) {
      return this.convention.afterTryingToCloseOuterContexts()
    }

    return false
  }

  close(): void {
    if (this.convention.onClose) {
      this.convention.onClose(this)
    }
  }

  resolve(): boolean {
    if (this.convention.resolveWhenUnclosed) {
      return this.convention.resolveWhenUnclosed(this)
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