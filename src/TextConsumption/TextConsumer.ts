export interface onTextMatch {
  (reject?: rejectTextMatch, consumer?: TextConsumer): void
}

interface rejectTextMatch {
  (): void
}

export class TextConsumer {

  public text: string;
  public index = 0;
  private isCurrentCharEscaped = false;
  private countUnclosedParen = 0;
  private countUnclosedSquareBracket = 0;

  constructor(text: string) {
    this.text = text

    this.handleEscaping()
  }


  done(): boolean {
    return this.index >= this.text.length
  }


  consume(needle: string, onSuccess?: onTextMatch): boolean {
    const isMatch =
      !this.isCurrentCharEscaped && (needle === this.text.substr(this.index, needle.length)) && this.areRelevantBracketsClosed(needle)

    if (isMatch) {
      const consumer = new TextConsumer(this.remaining())
      consumer.skip(needle.length)
      
      let isRejected = false
      
      if (onSuccess) {
        const reject = () => { isRejected = true }        
        onSuccess(reject, consumer)
      }
      
      if (isRejected) {
        return false
      }
      
      this.skip(consumer.countCharsAdvanced())
      
      return true
    }

    return false
  }


  moveNext(): void {
    // Only non-escaped brackets that weren't part of some match should affect the opened/closed counts we're keeping.
    if (!this.isCurrentCharEscaped) {
      this.updateOpenBracketCounts()
    }

    this.index += 1
    this.handleEscaping()
  }


  skip(count: number): void {
    this.index += count
    this.handleEscaping()
  }


  countCharsAdvanced(): number {
    return this.index
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
    // We only care about unclosed brackets if `needle` would appear to close them. If that's the case
    // we refuse to match `needle`, because the author likely intended it to be plain text.
    return (
      (!this.countUnclosedSquareBracket || !appearsToCloseAnyPreceedingBrackets(needle, '[', ']'))
      && (!this.countUnclosedParen || !appearsToCloseAnyPreceedingBrackets(needle, '(', ')'))
    )
  }
}

// Returns true if `text` contains any closing brackets that would appear to close any preceeding opening brackets.
//
// Assuming '(' and ')' are the specified brackets, the following examples would cause this function to return `true`:
//
//   )
//   ))
//   hello)
//   ( ))
//   ) ((((
//
// And the following examples would not:
//
//   ()
//   (( )
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
