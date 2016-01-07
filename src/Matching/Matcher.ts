import { MatchResult } from './MatchResult'
import { FailedMatchResult } from './FailedMatchResult'

export class Matcher {
  private isCurrentCharEscaped = false
  
  
  constructor(public text: string, public index = 0) {
    this.handleEscaping()
  }
  
  
  done(): boolean {
    return this.index >= this.text.length
  }
  
  
  match(needle: string): MatchResult {
    const success =
      !this.isCurrentCharEscaped && (needle === this.text.slice(this.index, needle.length))
    
    if (success) {
      return new MatchResult(this.index + needle.length, needle)
    }
    
    return new FailedMatchResult()
  }
  
  matchAnyChar(): MatchResult {
    return new MatchResult(this.index + 1, this.currentChar())
  }
  
  
  advance(result?: MatchResult) {
    if (result) {
      this.index = result.newIndex
    } else {
      this.index += 1
    }
    
    this.handleEscaping()
  }
  
  
  private handleEscaping() {
    this.isCurrentCharEscaped = false
    
    if (this.currentChar() === '\\') {
      this.index += 1
      this.isCurrentCharEscaped = true
    }
  }
  
  
  private currentChar(): string {
    return this.text[this.index]
  }
}