interface OnConsumption {
  (remainingText: string): void
}

interface OnLineConsumption {
  (line: string, remainingText: string): void
}

interface OnConsumingUpTo {
  (escapedTextBeforeNeedle: string, remainingText: string): void
}

interface rejectMatch {
  (): void
}

interface skipCountChars {
  (count: number): void
}


export class TextConsumer {
  private index = 0;
  private isCurrentCharEscaped = false;
  private countUnclosedParen = 0;
  private countUnclosedSquareBracket = 0;

  constructor(private text: string) {
    this.handleEscaping()
  }

  done(): boolean {
    return this.index >= this.text.length
  }

  consumeIf(needle: string, onMatchBeforeConsumption?: OnConsumption): boolean {
    const isMatch =
      !this.isCurrentCharEscaped && (needle === this.text.substr(this.index, needle.length)) && this.areRelevantBracketsClosed(needle)

    if (!isMatch) {
      return false
    }
    
    let charsToSkip = needle.length
    this.skip(needle.length)

    if (onMatchBeforeConsumption) {
      onMatchBeforeConsumption(this.remainingText())
    }

    return true
  }

  consumeLine(onLineConsumption?: OnLineConsumption): boolean {
    return this.consumeLineIf(null, onLineConsumption)
  }

  consumeLineIf(pattern: RegExp, onLineConsumption?: OnLineConsumption): boolean {
    if (this.done()) {
      return false
    }

    const consumer = new TextConsumer(this.remainingText())

    while (!consumer.done() && !consumer.consumeIf('\n')) {
      consumer.moveNext()
    }

    const line = consumer.consumed()
    const trimmedLine = line.replace(/\s+$/, '')

    if (pattern && !pattern.test(trimmedLine)) {
      return false
    }

    let charsToSkip = line.length
    this.skip(charsToSkip)

    if (onLineConsumption) {
      onLineConsumption(trimmedLine, this.remainingText())
    }

    return true
  }

  consumeUpTo(needle: string, onConsumingUpTo?: OnConsumingUpTo): boolean {
    const consumer = this.consumerForRemainingText()

    let foundNeedle = false
    let upToNeedle = ''

    while (!consumer.done() && !consumer.consumeIf(needle, () => { foundNeedle = true })) {
      upToNeedle += consumer.currentChar()
      consumer.moveNext()
    }

    if (!foundNeedle) {
      return false
    }

    this.skip(consumer.countCharsAdvanced())

    if (onConsumingUpTo) {
      onConsumingUpTo(upToNeedle, consumer.remainingText())
    }

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

  remainingText(): string {
    return this.text.slice(this.index)
  }

  consumed(): string {
    return this.text.substr(0, this.index)
  }

  currentChar(): string {
    return this.text[this.index]
  }

  private consumerForRemainingText(): TextConsumer {
    const clone = new TextConsumer('')

    clone.text = this.remainingText()
    clone.isCurrentCharEscaped = this.isCurrentCharEscaped
    clone.countUnclosedParen = this.countUnclosedParen
    clone.countUnclosedSquareBracket = this.countUnclosedSquareBracket

    return clone
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
function appearsToCloseAnyPreceedingBrackets(text: string, openingBracketChar: string, closingBracketChar: string): boolean {
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
