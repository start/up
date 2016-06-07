import { TokenizerGoal } from './TokenizerGoal'
import { TokenizableConvention } from './TokenizableConvention'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { PerformContextSpecificTasks } from './PerformContextSpecificTasks'
import { OnConventionClose } from './OnConventionClose'
import { TokenKind } from './TokenKind'

export class TokenizerContext {
  initialTokenIndex: number

  private beforeTryingToCloseOuterContexts: PerformContextSpecificTasks
  private afterTryingToCloseOuterContexts: PerformContextSpecificTasks
  private onClose: OnConventionClose

  constructor(public convention: TokenizableConvention, public snapshot: TokenizerSnapshot) {
    this.initialTokenIndex = snapshot.textIndex
    this.snapshot = snapshot
    this.beforeTryingToCloseOuterContexts = convention.beforeTryingToCloseOuterContexts
    this.afterTryingToCloseOuterContexts = convention.afterTryingToCloseOuterContexts
    this.onClose = convention.onClose

    this.reset()
  }

  doBeforeTryingToCloseOuterContexts(): boolean {
    if (this.beforeTryingToCloseOuterContexts) {
      return this.beforeTryingToCloseOuterContexts()
    }

    return false
  }

  doAfterTryingToCloseOuterContexts(): boolean {
    if (this.afterTryingToCloseOuterContexts) {
      return this.afterTryingToCloseOuterContexts()
    }

    return false
  }

  close(): void {
    if (this.onClose) {
      this.onClose(this)
    }
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