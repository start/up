import { TokenizerGoal } from './TokenizerGoal'
import { TokenizableConvention } from './TokenizableConvention'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { PerformContextSpecificTasks } from './PerformContextSpecificTasks'
import { OnTokenizerContextClose } from './OnTokenizerContextClose'
import { TokenKind } from './TokenKind'

export class TokenizerContext {
  goal: TokenizerGoal
  initialTokenIndex: number
  snapshot: TokenizerSnapshot
  beforeTryingToCloseOuterContexts: PerformContextSpecificTasks
  afterTryingToCloseOuterContexts: PerformContextSpecificTasks
  endPattern: RegExp
  doNotConsumeEndPattern: boolean
  closeInnerContextsWhenClosing: boolean
  onCloseFlushBufferTo: TokenKind

  private onClose: OnTokenizerContextClose

  constructor(
    convention: TokenizableConvention,
    snapshot: TokenizerSnapshot
  ) {
    this.initialTokenIndex = snapshot.textIndex
    this.snapshot = snapshot
    this.goal = convention.goal
    this.beforeTryingToCloseOuterContexts = convention.beforeTryingToCloseOuterContexts || doNothing
    this.afterTryingToCloseOuterContexts = convention.afterTryingToCloseOuterContexts || doNothing
    this.endPattern = convention.endPattern
    this.doNotConsumeEndPattern = convention.doNotConsumeEndPattern
    this.closeInnerContextsWhenClosing = convention.closeInnerContextsWhenClosing
    this.onCloseFlushBufferTo = convention.onCloseFlushBufferTo
    this.onClose = convention.onClose || doNothing

    this.reset()
  }

  close(): void {
    this.onClose(this)
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


function doNothing(): boolean {
  return false
}