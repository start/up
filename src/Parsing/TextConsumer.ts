interface OnLineConsumption {
  (line: string): void
}

interface ShouldConsumeLine {
  (line: string): boolean
}

interface OnConsumingUpTo {
  (beforeNeedle: string): void
}

export class TextConsumer {
  private index = 0;
  private countUnclosedParen = 0;
  private countUnclosedSquareBracket = 0;

  constructor(private text: string) { }

  done(): boolean {
    return (
      this.index >= this.text.length
      || this.isOnTrailingBackslash()
    )
  }

  consumeIfMatches(needle: string): boolean {
    const isMatch =
      needle === this.text.substr(this.index, needle.length)
      && this.areRelevantBracketsClosed(needle)

    if (!isMatch) {
      return false
    }

    this.skip(needle.length)
    return true
  }

  consumeLine(onLineConsumption?: OnLineConsumption): boolean {
    return this.consumeLineIf((line) => true, onLineConsumption)
  }

  consumeLineIfMatches(pattern: RegExp, onLineConsumption?: OnLineConsumption): boolean {
    return this.consumeLineIf((line) => pattern.test(line), onLineConsumption)
  }

  consumeLineIf(shouldConsumeLine: ShouldConsumeLine, onLineConsumption?: OnLineConsumption): boolean {
    if (this.done()) {
      return false
    }

    const consumer = new TextConsumer(this.remainingText())

    let line: string

    const didConsumeUpToLineBreak =
      consumer.consumeUpTo('\n', (upToLineBreak) => {
        line = upToLineBreak
      })

    if (!didConsumeUpToLineBreak) {
      line = consumer.remainingText()
      consumer.skipToEnd()
    }

    if (!shouldConsumeLine(line)) {
      return false
    }

    this.skip(consumer.countCharsConsumed())

    if (onLineConsumption) {
      onLineConsumption(line)
    }

    return true
  }

  consumeUpTo(needle: string, onConsumingUpTo?: OnConsumingUpTo): boolean {
    const consumer = new TextConsumer(this.remainingText())

    while (!consumer.done()) {
      if (consumer.consumeIfMatches(needle)) {
        this.skip(consumer.countCharsConsumed())

        if (onConsumingUpTo) {
          const consumedText = consumer.consumedText()
          const beforeNeedle = consumedText.substr(0, consumedText.length - needle.length)
          onConsumingUpTo(beforeNeedle)
        }

        return true
      }

      consumer.moveNext()
    }

    return false
  }

  moveNext(): void {
    // As a rule, we only count brackets found in plain, regular text. We ignore any brackets that are
    // consumed as part of a text match (i.e. delimiters for syntax rules). That's why we call
    // `updateUnclosedBracketCounts` here rather than in `skip`. 
    this.updateUnclosedBracketCounts()
    this.skip((this.isCurrentCharEscaped() ? 2 : 1))
  }

  skip(count: number): void {
    this.index += count
  }

  countCharsConsumed(): number {
    return this.index
  }

  remainingText(): string {
    return this.text.slice(this.index)
  }

  consumedText(): string {
    return this.text.substr(0, this.index)
  }

  escapedCurrentChar(): string {
    if (this.done()) {
      throw new Error('There is no more text!')
    }

    return (
      this.isCurrentCharEscaped()
        ? this.text[this.index + 1]
        : this.currentChar()
    )
  }

  private isCurrentCharEscaped(): boolean {
    return this.currentChar() === '\\'
  }

  private currentChar(): string {
    return this.text[this.index]
  }

  private isOnTrailingBackslash(): boolean {
    return (
      this.index === this.text.length - 1
      && this.isCurrentCharEscaped()
    )
  }

  private skipToEnd(): void {
    this.index = this.text.length
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
