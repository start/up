import { TokenizerState } from './TokenizerState'
import { FallibleTokenizerContext } from './FallibleTokenizerContext'

export class FailedStateTracker {
  private failedStatesByTextIndex: FailedStatesByTextIndex = {}
  
  registerFailure(failedContext: FallibleTokenizerContext): void {
    const { textIndex, state } = failedContext
    
    if (!this.failedStatesByTextIndex[textIndex]) {
      this.failedStatesByTextIndex[textIndex] = []
    }
    
    this.failedStatesByTextIndex[textIndex].push(state)
  }
  
  hasFailed(state: TokenizerState, textIndex: number): boolean {
    const failedStates = (this.failedStatesByTextIndex[textIndex] || [])
    return failedStates.some(failedState => failedState === state)
  }
}

interface FailedStatesByTextIndex {
  [textIndex: number]: TokenizerState[]
}