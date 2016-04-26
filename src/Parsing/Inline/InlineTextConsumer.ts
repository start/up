interface ConsumeArgs {
  from?: string
  upTo: string,
  then?: OnConsume
}

interface ConsumeIfMatchesPatternArgs {
  pattern: RegExp,
  then?: OnConsume
}
interface OnConsume {
  (text: string, ...captures: string[]): void
}

export class InlineTextConsumer {
  public countUnclosedParen = 0;
  public countUnclosedSquareBracket = 0;

  private index = 0;

  constructor(private text: string) { }

  done(): boolean {
    return (
      this.index >= this.text.length
      || this.isOnTrailingBackslash()
    )
  }

  consumeIfMatches(needle: string): boolean {
    if (!this.match(needle)) {
      return false
    }

    this.skip(needle.length)
    return true
  }

  consume(args: ConsumeArgs): boolean {
    const { upTo, then } = args
    const from = args.from || ''

    const consumer = new InlineTextConsumer(this.remainingText())

    if (from && !consumer.consumeIfMatches(from)) {
      return false
    }

    while (!consumer.done()) {
      if (consumer.consumeIfMatches(upTo)) {
        this.skip(consumer.lengthConsumed())

        if (then) {
          const text = consumer.consumedText().slice(from.length, -upTo.length)
          then(text)
        }

        return true
      }

      consumer.moveNext()
    }

    return false
  }

  consumeIfMatchesPattern(args: ConsumeIfMatchesPatternArgs): boolean {
    const { pattern, then } = args

    const result = pattern.exec(this.remainingText())

    if (!result) {
      return false
    }

    const match = result[0]
    const captures = result.slice(1)
    
    if (!this.areRelevantBracketsClosed(match)) {
      return false
    }
    
    this.skip(match.length)

    if (then) {
      then(match, ...captures)
    }

    return true
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

  lengthConsumed(): number {
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
        ? this.at(this.index + 1)
        : this.currentChar()
    )
  }

  currentChar(): string {
    return this.at(this.index)
  }

  at(index: number): string {
    return this.text[index]
  }
  
  // This method is a bit hackish.
  //
  // It returns a new TextConsumer object with an index that is `matchLength` behind the current object's.  
  //
  // Unfortunately, the returned TextConsumer is only guaranteed to have correct unclosed bracket counts
  // if this object hasn't advanced since its last match.
  asBeforeMatch(matchLength: number): InlineTextConsumer {
    const copy = new InlineTextConsumer('')

    copy.text = this.text
    copy.index = this.index - matchLength
    copy.countUnclosedParen = this.countUnclosedParen
    copy.countUnclosedSquareBracket = this.countUnclosedSquareBracket

    return copy
  }

  skipToEnd(): void {
    this.index = this.text.length
  }

  private match(needle: string) {
    return (
      needle === this.text.substr(this.index, needle.length)
      && this.areRelevantBracketsClosed(needle)
    )
  }

  private isCurrentCharEscaped(): boolean {
    return this.currentChar() === '\\'
  }


  private isOnTrailingBackslash(): boolean {
    return (
      this.index === this.text.length - 1
      && this.isCurrentCharEscaped()
    )
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
