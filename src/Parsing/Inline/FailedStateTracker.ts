import { TokenizerState } from './TokenizerState'
import { TokenizerContext } from './TokenizerContext'

export class FailedStateTracker {
  private failedStatesByTextIndex: FailedStatesByTextIndex = {}
  
  registerFailure(failedContext: TokenizerContext): void {
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
