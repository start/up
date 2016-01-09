import { MatchResult } from './MatchResult'
import { FailedMatchResult } from './FailedMatchResult'

export class Matcher {

  public text: string;
  public index: number;
  private isCurrentCharEscaped = false;
  private countUnclosedParen = 0;
  private countUnclosedSquareBracket = 0;



  constructor(textOrMatcher: string | Matcher, implicitFirstMatch = '') {
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
      !this.isCurrentCharEscaped && (needle === this.text.substr(this.index, needle.length)) && this.areRelevantBracketsClosed(needle)

    if (success) {
      return new MatchResult(this.index + needle.length, needle)
    }

    return new FailedMatchResult()
  }


  advanceBy(countOrResult: MatchResult | number): void {
    if (countOrResult instanceof MatchResult) {
      this.index = countOrResult.newIndex
    } else {
      this.index += <number>countOrResult
    }

    this.handleEscaping()
  }


  advance(): void {
    // Only non-escaped brackets that weren't part of some match should affect the opened/closed counts we're keeping.
    if (!this.isCurrentCharEscaped) {
      this.updateOpenBracketCounts()
    }

    this.index += 1
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


  currentChar(): string {
    return this.text[this.index]
  }


  private handleEscaping() {
    this.isCurrentCharEscaped = false

    if (this.currentChar() === '\\') {
      this.index += 1
      this.isCurrentCharEscaped = true
    }
  }


  private updateOpenBracketCounts(): void {
    switch (this.currentChar()) {
      case '(':
        this.countUnclosedParen += 1
        break
      case ')':
        this.countUnclosedParen = Math.max(0, this.countUnclosedParen - 1)
        break
      case '[':
        this.countUnclosedSquareBracket += 1
        break
      case ']':
        this.countUnclosedSquareBracket = Math.max(0, this.countUnclosedSquareBracket - 1)
        break
    }
  }


  private areRelevantBracketsClosed(needle: string): boolean {
    return (
      (!this.countUnclosedSquareBracket || !appearsToClosePreceedingBracket(needle, '[', ']'))
      && (!this.countUnclosedParen || !appearsToClosePreceedingBracket(needle, '(', ')'))
    )
  }
}

// Returns true if `text` contains a closing bracket that would appear to close a preceeding opening bracket.
//
// The following examples satisfy that condition:
//
//   )
//   hello)
//   ( ))
//   ) ((((
//
// And the following examples do not:
//
//   ()
//   (( ))
function appearsToClosePreceedingBracket(text: string, openingBracket: string, closingBracket: string) {
  let countSurplusOpened = 0

  for (let char of text) {
    
    switch (char) {
      case openingBracket:
        countSurplusOpened += 1
        break
        
      case closingBracket:
        if (!countSurplusOpened) {
          return true
        }
        countSurplusOpened -= 1
        break
    }  
  }

  return false
}
