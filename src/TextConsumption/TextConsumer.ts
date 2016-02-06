interface onMatchBeforeConsumption {
  (remaining?: string, skip?: skipCountChars, reject?: rejectMatch): void
}

interface beforeLineConsumption {
  (line: string, remaining?: string, skip?: skipCountChars, reject?: rejectMatch): void
}

interface rejectMatch {
  (): void
}

interface skipCountChars {
  (count: number): void
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


  consumeIf(needle: string, onMatchBeforeConsumption?: onMatchBeforeConsumption): boolean {
    const isMatch =
      !this.isCurrentCharEscaped && (needle === this.text.substr(this.index, needle.length)) && this.areRelevantBracketsClosed(needle)

    if (isMatch) {
      let isRejected = false
      let charsToSkip = needle.length

      if (onMatchBeforeConsumption) {
        const skip = (count: number) => { charsToSkip += count }
        const reject = () => { isRejected = true }
        onMatchBeforeConsumption(this.remaining().substr(charsToSkip), skip, reject)
      }

      if (isRejected) {
        return false
      }

      this.skip(charsToSkip)
      return true
    }

    return false
  }

  
  consumeLine(beforeLineConsumption: beforeLineConsumption): boolean {
    return this.consumeLineIf(null, beforeLineConsumption)
  }

  
  consumeLineIf(pattern: string, beforeLineConsumption: beforeLineConsumption): boolean {
    const consumer = new TextConsumer(this.remaining())

    while (!consumer.done() && !consumer.consumeIf('\n')) {
      consumer.moveNext()
    }

    const line = consumer.consumed()
    const trimmedLine = line.replace(/\s+$/, '')
    
    if (pattern && !new RegExp(pattern).test(trimmedLine)) {
      return false
    }

    let isRejected = false
    let charsToSkip = line.length

    if (beforeLineConsumption) {
      const remaining = this.remaining()
      const remainingAfterLine = remaining.substr(charsToSkip)

      const skip = (count: number) => { charsToSkip += count }
      const reject = () => { isRejected = true }

      beforeLineConsumption(trimmedLine, remainingAfterLine, skip, reject)
    }

    if (isRejected) {
      return false
    }

    this.skip(charsToSkip)
    return true
  }


  moveNext(): void {
    // Only non-escaped brackets that weren't part of a match should affect the opened/closed counts we're keeping.
    if (!this.isCurrentCharEscaped) {
      this.updateUnclosedBracketCounts()
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


  consumed(): string {
    return this.text.substr(0, this.index)
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


  private updateUnclosedBracketCounts(): void {
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
    // We only care about unclosed brackets if `needle` would appear to close them. If that's the case,
    // we refuse to match `needle`, because the author likely intended the needle to be plain text.
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
function appearsToCloseAnyPreceedingBrackets(text: string, openingBracketChar: string, closingBracketChar: string) {
  let countSurplusOpened = 0

  for (let char of text) {

    switch (char) {
      case openingBracketChar:
        countSurplusOpened += 1
        break

      case closingBracketChar:
        if (!countSurplusOpened) {
          return true
        }
        countSurplusOpened -= 1
        break
    }
  }

  return false
}
