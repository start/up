import { TokenizableConvention } from './TokenizableConvention'
import { TokenizerContext } from './TokenizerContext'

export class FailedConventionTracker {
  private failedGoalsByTextIndex: FailedGoalsByTextIndex = {}
  
  registerFailure(failedContext: TokenizerContext): void {
    const { convention, snapshot } = failedContext
    const { textIndex } = snapshot
    
    if (!this.failedGoalsByTextIndex[textIndex]) {
      this.failedGoalsByTextIndex[textIndex] = []
    }
    
    this.failedGoalsByTextIndex[textIndex].push(convention)
  }
  
  hasFailed(convention: TokenizableConvention, textIndex: number): boolean {
    const failedConventions = (this.failedGoalsByTextIndex[textIndex] || [])
    return failedConventions.some(failedConvention => failedConvention === convention)
  }
}

interface FailedGoalsByTextIndex {
  [textIndex: number]: TokenizableConvention[]
}
