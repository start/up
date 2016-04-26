interface ConsumeArgs {
  from?: string
  upTo: string,
  then?: OnConsume
}

interface ConsumeLineArgs {
  pattern?: RegExp,
  if?: ShouldConsumeLine,
  then?: OnConsume
}

interface ConsumeIfMatchesPatternArgs {
  pattern: RegExp,
  then?: OnConsume
}

interface ShouldConsumeLine {
  (line: string, ...captures: string[]): boolean
}

interface OnConsume {
  (text: string, ...captures: string[]): void
}

export class OutlineTextConsumer {
  private index = 0;

  constructor(private text: string) { }

  done(): boolean {
    return (
      this.index >= this.text.length
      || this.isOnTrailingBackslash()
    )
  }

  consumeLine(args: ConsumeLineArgs): boolean {
    if (this.done()) {
      return false
    }

    const consumer = new OutlineTextConsumer(this.remainingText())

    let line: string

    const wasAbleToConsumeUpToLineBreak =
      consumer.consume({
        upTo: '\n',
        then: (upToLineBreak) => { line = upToLineBreak }
      })

    if (!wasAbleToConsumeUpToLineBreak) {
      line = consumer.remainingText()
      consumer.skipToEnd()
    }

    let captures: string[] = []

    if (args.pattern) {
      const results = args.pattern.exec(line)

      if (!results) {
        return false
      }

      captures = results.slice(1)
    }

    if (args.if && !args.if(line, ...captures)) {
      return false
    }

    this.skip(consumer.lengthConsumed())

    if (args.then) {
      args.then(line, ...captures)
    }

    return true
  }

  consume(args: ConsumeArgs): boolean {
    const { upTo, then } = args
    const from = args.from || ''

    const consumer = new OutlineTextConsumer(this.remainingText())

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

  consumeIfMatches(needle: string): boolean {
    if (!this.match(needle)) {
      return false
    }

    this.skip(needle.length)
    return true
  }

  moveNext(): void {
    // As a rule, we only count brackets found in plain, regular text. We ignore any brackets that are
    // consumed as part of a text match (i.e. delimiters for syntax rules). That's why we call
    // `updateUnclosedBracketCounts` here rather than in `skip`. 
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

  private match(needle: string) {
    return needle === this.text.substr(this.index, needle.length)
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

  private skipToEnd(): void {
    this.index = this.text.length
  }
}
