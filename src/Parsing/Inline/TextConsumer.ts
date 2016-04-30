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

export class TextConsumer {
  private isCurrentCharEscaped = false
  private index = 0

  constructor(private text: string) {
    this.applyEscaping()
  }

  done(): boolean {
    return this.index >= this.text.length
  }

  consumeIfMatches(needle: string): boolean {
    const isMatch = (
      !this.cannotMatchAnything()
      && needle === this.text.substr(this.index, needle.length)
    )

    if (!isMatch) {
      return false
    }

    this.advanceAfterMatch(needle.length)
    return true
  }

  consume(args: ConsumeArgs): boolean {
    if (this.cannotMatchAnything()) {
      return false
    }

    const { upTo, then } = args
    const from = args.from || ''

    const consumer = new TextConsumer(this.remainingText())

    if (from && !consumer.consumeIfMatches(from)) {
      return false
    }

    while (!consumer.done()) {
      if (consumer.consumeIfMatches(upTo)) {
        this.advanceAfterMatch(consumer.lengthConsumed())

        if (then) {
          const text = consumer.text.slice(from.length, consumer.index - upTo.length)
          then(text)
        }

        return true
      }

      consumer.advanceToNextChar()
    }

    return false
  }

  consumeIfMatchesPattern(args: ConsumeIfMatchesPatternArgs): boolean {
    if (this.cannotMatchAnything()) {
      return false
    }

    const { pattern, then } = args

    const result = pattern.exec(this.remainingText())

    if (!result) {
      return false
    }

    const match = result[0]
    const captures = result.slice(1)

    this.advanceAfterMatch(match.length)

    if (then) {
      then(match, ...captures)
    }

    return true
  }

  advanceToNextChar(): void {
    this.advanceAfterMatch(1)
  }

  advanceAfterMatch(matchLength: number): void {
    this.index += matchLength
    this.applyEscaping()
  }

  lengthConsumed(): number {
    return this.index
  }

  remainingText(): string {
    return this.text.slice(this.index)
  }

  // TODO: Reconsider this method
  escapedCurrentChar(): string {
    if (this.done()) {
      throw new Error('There is no more text!')
    }

    return this.currentChar()
  }

  currentChar(): string {
    return this.at(this.index)
  }

  at(index: number): string {
    return this.text[index]
  }

  // This method is hackish, and it'll likley need to be replaced.
  //
  // It returns a new TextConsumer object with an index that is `matchLength` behind the current object's.
  asBeforeMatch(matchLength: number): TextConsumer {
    const copy = new TextConsumer(this.text)
    copy.index = this.index - matchLength

    return copy
  }
  
  skipToEnd(): void {
    this.index = this.text.length
  }

  private cannotMatchAnything(): boolean {
    return this.isCurrentCharEscaped || this.done()
  }

  private applyEscaping(): void {
    this.isCurrentCharEscaped = (this.currentChar() === '\\')

    if (this.isCurrentCharEscaped) {
      this.index += 1
    }
  }
}
