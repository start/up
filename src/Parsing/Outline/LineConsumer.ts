export class LineConsumer {
  countCharsConsumed = 0
  remainingText: string

  constructor(private entireText: string) {
    this.updateRemainingText()
  }

  advance(countCharacters: number): void {
    this.countCharsConsumed += countCharacters
    this.updateRemainingText()
  }

  done(): boolean {
    return this.countCharsConsumed >= this.entireText.length
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
    for (let i = this.countCharsConsumed; i < this.entireText.length; i++) {
      const char = this.entireText[i]

      // Escaped line breaks don't end lines
      if (char === '\\') {
        i++
        continue
      }

      if (char === '\n') {
        fullLine = this.entireText.substring(this.countCharsConsumed, i + 1)
        lineWithoutTerminatingLineBreak = fullLine.slice(0, -1)
        break
      }
    }

    if (!fullLine) {
      // Well, we couldn't find a terminating line break! That must mean we're on the text's final line.
      fullLine = lineWithoutTerminatingLineBreak = this.remainingText
    }

    let captures: string[] = []

    if (args.pattern) {
      const results = args.pattern.exec(lineWithoutTerminatingLineBreak)

      if (!results) {
        return false
      }

      [ , ...captures] = results
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

  private updateRemainingText(): void {
    this.remainingText = this.entireText.slice(this.countCharsConsumed)
  }
}


interface ShouldConsumeLine {
  (line: string, ...captures: string[]): boolean
}

interface OnConsume {
  (text: string, ...captures: string[]): void
}
