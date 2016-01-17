import { ConsumedTextResult } from './ConsumedTextResult'

export interface onTextMatch {
  (reject?: rejectTextMatch, consumer?: TextConsumer): void
}

interface rejectTextMatch {
  (): void
}

export class TextConsumer {

  public text: string;
  public index: number;
  private isCurrentCharEscaped = false;
  private countUnclosedParen = 0;
  private countUnclosedSquareBracket = 0;

  constructor(textOrMatcher: string | TextConsumer, implicitFirstMatch = '') {
    if (textOrMatcher instanceof TextConsumer) {
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


  consume(needle: string, onSuccess?: onTextMatch): boolean {
    const isMatch =
      !this.isCurrentCharEscaped && (needle === this.text.substr(this.index, needle.length)) && this.areRelevantBracketsClosed(needle)

    if (isMatch) {
      const result = new ConsumedTextResult(this.index + needle.length, needle)
      
      const clone = this.clone()
      clone.advanceBy(result)
      
      let isRejected = false
      
      if (onSuccess) {
        const reject =  () => { isRejected = true }
        
        onSuccess(reject, clone)
      }
      
      if (isRejected) {
        return false
      }
      
      this.mimic(clone)
      
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


  advanceBy(countOrResult: ConsumedTextResult | number): void {
    if (countOrResult instanceof ConsumedTextResult) {
      this.index = countOrResult.newIndex
    } else {
      this.index += <number>countOrResult
    }

    this.handleEscaping()
  }


  countCharsAdvanced(): number {
    return this.index
  }


  countCharsAdvancedIncluding(result: ConsumedTextResult): number {
    return this.countCharsAdvanced() + result.text.length
  }


  remaining(): string {
    return this.text.slice(this.index)
  }


  currentChar(): string {
    return this.text[this.index]
  }
  
  
  private clone(): TextConsumer {
    const clone = new TextConsumer('')
    
    clone.mimic(this)
    
    return clone
  }
  
  
  private mimic(other: TextConsumer) {
    this.text = other.text
    this.index = other.index
    this.isCurrentCharEscaped = other.isCurrentCharEscaped
    this.countCharsAdvanced = other.countCharsAdvanced
    this.countUnclosedParen = other.countUnclosedParen
    this.countUnclosedSquareBracket = other.countUnclosedSquareBracket
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
