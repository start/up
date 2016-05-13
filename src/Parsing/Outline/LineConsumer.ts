export class LineConsumer {
  private index = 0
  private _remainingText: string

  constructor(private text: string) {
    this.dirty()
  }

  consumeLine(
    args: {
      pattern?: RegExp,
      if?: ShouldConsumeLine,
      then?: OnConsume
    }
  ): boolean {
    if (this.done()) {
      return false
    }

    let fullLine: string
    let lineWithoutTerminatingLineBreak: string

    // First, let's find the end of the current line
    for (let i = this.index; i < this.text.length; i++) {
      const char = this.text[i]

      // Escaped line breaks don't end lines
      if (char === '\\') {
        i++
        continue
      }

      if (char === '\n') {
        fullLine = this.text.substring(this.index, i + 1)
        lineWithoutTerminatingLineBreak = fullLine.slice(0, -1)
        break
      }
    }

    if (!fullLine) {
      // Well, we couldn't find a terminating line break! That must mean we're on the text's final line.
      fullLine = lineWithoutTerminatingLineBreak = this.remainingText()
    }

    let captures: string[] = []

    if (args.pattern) {
      const results = args.pattern.exec(lineWithoutTerminatingLineBreak)

      if (!results) {
        return false
      }

      captures = results.slice(1)
    }

    if (args.if && !args.if(lineWithoutTerminatingLineBreak, ...captures)) {
      return false
    }

    this.advance(fullLine.length)

    if (args.then) {
      args.then(lineWithoutTerminatingLineBreak, ...captures)
    }

    return true
  }

  done(): boolean {
    return this.index >= this.text.length
  }

  advance(countCharacters: number): void {
    this.index += countCharacters
    this.dirty()
  }

  lengthConsumed(): number {
    return this.index
  }

  remainingText(): string {
    return this._remainingText
  }

  private dirty(): void {
    this._remainingText = this.text.slice(this.index)
  }
}


interface ShouldConsumeLine {
  (line: string, ...captures: string[]): boolean
}

interface OnConsume {
  (text: string, ...captures: string[]): void
}