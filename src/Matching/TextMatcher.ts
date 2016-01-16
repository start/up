import { TextMatchResult } from './TextMatchResult'
import { FailedTextMatchResult } from './FailedTextMatchResult'

export interface onTextMatch {
  (result: TextMatchResult, reject?: rejectTextMatch, advance?: advanceTextMatcher): void
}

interface rejectTextMatch {
  (): void
}

interface advanceTextMatcher {
  (countChars: number): void
}

export class TextMatcher {

  public text: string;
  public index: number;
  private isCurrentCharEscaped = false;
  private countUnclosedParen = 0;
  private countUnclosedSquareBracket = 0;

  constructor(textOrMatcher: string | TextMatcher, implicitFirstMatch = '') {
    if (textOrMatcher instanceof TextMatcher) {
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


  match(needle: string, onSuccess?: onTextMatch): boolean {
    const isMatch =
      !this.isCurrentCharEscaped && (needle === this.text.substr(this.index, needle.length)) && this.areRelevantBracketsClosed(needle)

    if (isMatch) {
      const result = new TextMatchResult(this.index + needle.length, needle)
      
      let isRejected = false
      let countCharsToAdvance = 0
      
      if (onSuccess) {
        const reject =  () => { isRejected = true }
        const advance = (count: number) => countCharsToAdvance = count
        
        onSuccess(result, reject, advance)
      }
      
      if (isRejected) {
        return false
      }
      
      if (countCharsToAdvance) {
        this.advanceBy(countCharsToAdvance)
      } else {
        this.advanceBy(result)
      }
      
      return true
    }

    return false
  }


  advance(): void {
    // Only non-escaped brackets that weren't part of some match should affect the opened/closed counts we're keeping.
    if (!this.isCurrentCharEscaped) {
      this.updateOpenBracketCounts()
    }

    this.index += 1
    this.handleEscaping()
  }


  advanceBy(countOrResult: TextMatchResult | number): void {
    if (countOrResult instanceof TextMatchResult) {
      this.index = countOrResult.newIndex
    } else {
      this.index += <number>countOrResult
    }

    this.handleEscaping()
  }


  countCharsAdvanced(): number {
    return this.index
  }


  countCharsAdvancedIncluding(result: TextMatchResult): number {
    return this.countCharsAdvanced() + result.text.length
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
      (!this.countUnclosedSquareBracket || !appearsToCloseAnyPreceedingBrackets(needle, '[', ']'))
      && (!this.countUnclosedParen || !appearsToCloseAnyPreceedingBrackets(needle, '(', ')'))
    )
  }
}

// Returns true if `text` contains any closing brackets that appear to close any preceeding opening brackets.
//
// The following examples satisfy that criteria:
//
//   )
//   ))
//   hello)
//   ( ))
//   ) ((((
//
// And the following examples do not:
//
//   ()
//   (( ))
//
// This method helps us determine whether any preceeding unclosed brackets even matter.
function appearsToCloseAnyPreceedingBrackets(text: string, openingBracket: string, closingBracket: string) {
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
