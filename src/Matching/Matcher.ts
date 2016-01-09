import { MatchResult } from './MatchResult'
import { FailedMatchResult } from './FailedMatchResult'

export class Matcher {
  public text: string
  private isCurrentCharEscaped = false
  public index: number
  
  
  constructor(textOrMatcher: string|Matcher, implicitFirstMatch = '') {
    if (textOrMatcher instanceof Matcher) {
      this.text = textOrMatcher.remaining()
    } else {
      this.text = <string>textOrMatcher
    }
    
    this.index = implicitFirstMatch.length
    this.handleEscaping()
  }
  
  
  done(): boolean {
    return this.index >= this.text.length
  }
  
  
  match(needle: string): MatchResult {
    const success =
      !this.isCurrentCharEscaped && (needle === this.text.substr(this.index, needle.length))
    
    if (success) {
      return new MatchResult(this.index + needle.length, needle)
    }
    
    return new FailedMatchResult()
  }
  
  
  matchAnyChar(): MatchResult {
    return new MatchResult(this.index + 1, this.currentChar())
  }
  
  
  advance(countOrResult: MatchResult|number = 1) {
    if (countOrResult instanceof MatchResult) {
      this.index = countOrResult.newIndex
    } else {
      this.index += <number>countOrResult
    }
    
    this.handleEscaping()
  }
  
  
  countCharsAdvanced(): number {
    return this.index
  }
  
  
  countCharsAdvancedIncluding(result: MatchResult): number {
    return this.countCharsAdvanced() + result.matchedText.length
  }
  
  
  remaining(): string {
    return this.text.slice(this.index)
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