import { Convention } from './Convention'
import { Token, TokenMeaning } from './Token'

export class FailureTracker {
  failures: TokenMeaning[][] = []
  
  registerConventionFailure(convention: Convention, textIndex: number) {
    const startTokenMeaning = convention.startTokenMeaning()
    
    if (this.hasNoFailuresAt(textIndex)) {
      this.failures[textIndex] = [startTokenMeaning]
    } else {
      this.failures[textIndex].push(startTokenMeaning)
    }
  }
  
  registerFailure(startTokenMeaning: TokenMeaning, textIndex: number) {
    if (this.hasNoFailuresAt(textIndex)) {
      this.failures[textIndex] = [startTokenMeaning]
    } else {
      this.failures[textIndex].push(startTokenMeaning)
    }
  }
  
  hasConventionFailed(convention: Convention, textIndex: number): boolean {
    if (this.hasNoFailuresAt(textIndex)) {
      return false
    }
    
    return -1 !== this.failures[textIndex].indexOf(convention.startTokenMeaning())
  }
  
  hasFailed(startTokenMeaning: TokenMeaning, textIndex: number): boolean {
    if (this.hasNoFailuresAt(textIndex)) {
      return false
    }
    
    return -1 !== this.failures[textIndex].indexOf(startTokenMeaning)
  }
  
  private hasNoFailuresAt(textIndex: number): boolean {
    return !this.failures[textIndex]
  }
}
