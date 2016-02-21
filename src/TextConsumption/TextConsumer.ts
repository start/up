interface OnLineConsumption {
  (line: string): void
}

interface OnConsumingUpTo {
  (beforeNeedle: string): void
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
    
    let line: string

    const didConsumeUpToLineBreak =
      consumer.consumeUpTo('\n', (upToLineBreak) => {
        line = upToLineBreak
      })

    if (!didConsumeUpToLineBreak) {
      line = consumer.rawRemainingText()
      consumer.skipToEnd()
    }

    if (pattern && !pattern.test(line)) {
      return false
    }

    this.skip(consumer.countRawCharsConsumed())
    
    if (onLineConsumption) {
      onLineConsumption(line)
    }

    return true
  }

  consumeUpTo(needle: string, onConsumingUpTo?: OnConsumingUpTo): boolean {
    const consumer = this.getConsumerForRemainingText()

    while (!consumer.done()) {
      if (consumer.consumeIf(needle)) {
        this.skip(consumer.countRawCharsConsumed())

        if (onConsumingUpTo) {
          const consumedText = consumer.rawConsumedText()
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

  countRawCharsConsumed(): number {
    return this.index
  }

  rawRemainingText(): string {
    return this.text.slice(this.index)
  }

  rawConsumedText(): string {
    return this.text.substr(0, this.index)
  }

  currentChar(): string {
    return this.text[this.index]
  }

  private skipToEnd(): void {
    this.index = this.text.length
  }

  private getConsumerForRemainingText(): TextConsumer {
    const clone = new TextConsumer(this.rawRemainingText())

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
