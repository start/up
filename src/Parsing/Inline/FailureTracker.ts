import { RichSandwich } from './RichSandwich'
import { Token, TokenMeaning } from './Token'

export class FailureTracker {
  failures: TokenMeaning[][] = []
  
  registerFailure(meaningStart: TokenMeaning, textIndex: number) {
    if (this.hasNoFailuresAt(textIndex)) {
      this.failures[textIndex] = [meaningStart]
    } else {
      this.failures[textIndex].push(meaningStart)
    }
  }
  
  wasSandwichAlreadyTried(sandwich: RichSandwich, textIndex: number): boolean {
    return this.hasFailed(sandwich.convention.startTokenMeaning(), textIndex)
  }
  
  hasFailed(meaningStart: TokenMeaning, textIndex: number): boolean {
    if (this.hasNoFailuresAt(textIndex)) {
      return false
    }
    
    return -1 !== this.failures[textIndex].indexOf(meaningStart)
  }
  
  private hasNoFailuresAt(textIndex: number): boolean {
    return !this.failures[textIndex]
  }
}