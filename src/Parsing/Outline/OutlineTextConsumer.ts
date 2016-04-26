import { InlineTextConsumer } from '../Inline/InlineTextConsumer'


interface ConsumeLineArgs {
  pattern?: RegExp,
  if?: ShouldConsumeLine,
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

    const inlineConsumer = new InlineTextConsumer(this.remainingText())

    let line: string

    const wasAbleToConsumeUpToLineBreak =
      inlineConsumer.consume({
        upTo: '\n',
        then: (upToLineBreak) => { line = upToLineBreak }
      })

    if (!wasAbleToConsumeUpToLineBreak) {
      line = inlineConsumer.remainingText()
      inlineConsumer.skipToEnd()
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

    this.skip(inlineConsumer.lengthConsumed())

    if (args.then) {
      args.then(line, ...captures)
    }

    return true
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

  private moveNext(): void {
    // As a rule, we only count brackets found in plain, regular text. We ignore any brackets that are
    // consumed as part of a text match (i.e. delimiters for syntax rules). That's why we call
    // `updateUnclosedBracketCounts` here rather than in `skip`. 
    this.skip((this.isCurrentCharEscaped() ? 2 : 1))
  }

  private consumedText(): string {
    return this.text.substr(0, this.index)
  }

  private currentChar(): string {
    return this.at(this.index)
  }

  private at(index: number): string {
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
