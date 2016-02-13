interface OnLineConsumption {
  (line: string): void
}

interface OnConsumingUpTo {
  (escapedTextBeforeNeedle: string): void
}

// During parsing, a backslash "escapes" (disables) any special meaning the following character
// might have. Instead, that character is treated as plain text.
//
// When using TextConsumer's `moveNext`, `consumeIf`, and `currentChar` methods, this occurs
// completely transparently to the caller. They never have to deal with backslashes, unless
// the backslash has been escaped into plain text. 
//
// On the other hand, TextConsumer's `consumeLine` and `consumeUpTo` methods provide callers
// with a raw string, backslashes and all. In some cases, the caller will subsequently parse
// that raw string, like when parsing a paragraph for inline conventions. In other cases, the
// caller will immediately put the raw string into a syntax node, like when parsing a block of
// code (in code blocks, all backslashes are preserved).
//
// However, sometimes, the caller just wants a string with the backslash escaping already
// applied, like when parsing inline code or a link's URL. This could be accomplished by using
// the `moveNext` and `currentChar` methods, but the following function makes it much easier. 
export function applyBackslashEscaping(text: string) {
  return text.replace(/\\(.?)/g, '$1')
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

  consumeIf(needle: string): boolean {
    const isMatch =
      !this.isCurrentCharEscaped
      && (needle === this.text.substr(this.index, needle.length))
      && this.areRelevantBracketsClosed(needle)

    if (!isMatch) {
      return false
    }

    this.skip(needle.length)
    return true
  }

  consumeLine(onLineConsumption?: OnLineConsumption): boolean {
    return this.consumeLineIf(null, onLineConsumption)
  }

  consumeLineIf(pattern: RegExp, onLineConsumption?: OnLineConsumption): boolean {
    if (this.done()) {
      return false
    }

    const consumer = this.getConsumerForRemainingText()
    let endsWithLineBreak = false

    while (!consumer.done()) {
      if (consumer.consumeIf('\n')) {
        endsWithLineBreak = true
        break
      }
      
      consumer.moveNext()
    }

    const line = consumer.consumed()
    const lineWithoutFinalLineBreak = (
      endsWithLineBreak
        ? line.substr(0, line.length - 1)
        : line
    )

    if (pattern && !pattern.test(lineWithoutFinalLineBreak)) {
      return false
    }

    this.skip(line.length)

    if (onLineConsumption) {
      onLineConsumption(lineWithoutFinalLineBreak)
    }

    return true
  }

  consumeUpTo(needle: string, onConsumingUpTo?: OnConsumingUpTo): boolean {
    const consumer = this.getConsumerForRemainingText()

    let escapedTextBeforeNeedle = ''

    while (!consumer.done()) {
      if (consumer.consumeIf(needle)) {
        this.skip(consumer.countCharsAdvanced())

        if (onConsumingUpTo) {
          onConsumingUpTo(escapedTextBeforeNeedle)
        }

        return true
      }

      escapedTextBeforeNeedle += consumer.currentChar()
      consumer.moveNext()
    }

    return false
  }

  moveNext(): void {
    // Only non-escaped brackets that weren't part of a match should affect the opened/closed counts we're keeping.
    if (!this.isCurrentCharEscaped) {
      this.updateUnclosedBracketCounts()
    }

    this.skip(1)
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

  private getConsumerForRemainingText(): TextConsumer {
    const clone = new TextConsumer(this.remainingText())

    clone.isCurrentCharEscaped = this.isCurrentCharEscaped

    return clone
  }

  private handleEscaping(): void {
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
