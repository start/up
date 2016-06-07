import { TokenizerGoal } from './TokenizerGoal'
import { TokenizerContext } from './TokenizerContext'

export class FailedGoalTracker {
  private failedGoalsByTextIndex: FailedGoalsByTextIndex = {}
  
  registerFailure(failedContext: TokenizerContext): void {
    const { convention, snapshot } = failedContext
    const { textIndex } = snapshot
    
    if (!this.failedGoalsByTextIndex[textIndex]) {
      this.failedGoalsByTextIndex[textIndex] = []
    }
    
    this.failedGoalsByTextIndex[textIndex].push(convention.goal)
  }
  
  hasFailed(goal: TokenizerGoal, textIndex: number): boolean {
    const failedGoals = (this.failedGoalsByTextIndex[textIndex] || [])
    return failedGoals.some(failedGoal => failedGoal === goal)
  }
}

interface FailedGoalsByTextIndex {
  [textIndex: number]: TokenizerGoal[]
}
