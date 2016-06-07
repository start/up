import { TokenizerGoal } from './TokenizerGoal'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { PerformContextSpecificTasks } from './PerformContextSpecificTasks'
import { OnMatch } from './OnMatch'
import { TokenKind } from './TokenKind'

export class TokenizerContext {
  goal: TokenizerGoal
  initialTokenIndex: number
  snapshot: TokenizerSnapshot
  whileOpen: PerformContextSpecificTasks 
  endPattern: RegExp
  doNotConsumeEndPattern: boolean
  closeInnerContextsToo: boolean
  onCloseFlushBufferTo: TokenKind
  onClose: OnMatch

  constructor(
    args: {
      goal: TokenizerGoal
      snapshot: TokenizerSnapshot
      whileOpen: PerformContextSpecificTasks 
      endPattern: RegExp
      doNotConsumeEndPattern: boolean
      closeInnerContextsToo: boolean
      onCloseFlushBufferTo: TokenKind
      onClose: OnMatch
    }
  ) {
    this.snapshot = args.snapshot
    this.initialTokenIndex = args.snapshot.textIndex
    this.whileOpen = args.whileOpen
    this.endPattern = this.endPattern
    this.doNotConsumeEndPattern = args.doNotConsumeEndPattern
    this.closeInnerContextsToo = args.closeInnerContextsToo
    this.onCloseFlushBufferTo = args.onCloseFlushBufferTo
    this.onClose = args.onClose
    
    this.reset()
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