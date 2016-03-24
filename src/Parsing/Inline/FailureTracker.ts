import { RichSandwich } from './RichSandwich'
import { Token, TokenMeaning } from './Token'

export class FailureTracker {
  failures: TokenMeaning[][] = []
    
  wasSandwichAlreadyTried(sandwich: RichSandwich, index: number): boolean {
    return this.hasFailed(sandwich.meaningStart, index)
  }
  
  private registerFailure(meaningStart: TokenMeaning, index: number) {
    if (this.hasNoFailuresAtIndex(index)) {
      this.failures[index] = [meaningStart]
    } else {
      this.failures[index].push(meaningStart)
    }
  }
  
  private hasFailed(meaningStart: TokenMeaning, index: number): boolean {
    if (this.hasNoFailuresAtIndex(index)) {
      return false
    }
    
    return -1 !== this.failures[index].indexOf(meaningStart)
  }
  
  private hasNoFailuresAtIndex(index: number): boolean {
    return !this.failures[index]
  }
}