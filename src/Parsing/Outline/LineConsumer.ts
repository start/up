export class LineConsumer {
  private _textIndex: number
  private _remainingText: string

  constructor(private entireText: string) {
    this.setTextIndex(0)
  }
  
  get textIndex(): number {
    return this._textIndex
  }
  
  private setTextIndex(value: number): void {
    this._textIndex = value
    this._remainingText = this.entireText.slice(this.textIndex) 
  }
  
  get remainingText(): string {
    return this._remainingText
  }

  advanceTextIndex(length: number): void {
    this.setTextIndex(this.textIndex + length) 
  }

  reachedEndOfText(): boolean {
    return this.textIndex >= this.entireText.length
  }
  
  consume(
    args: {
      linePattern?: RegExp,
      if?: ShouldConsumeLine,
      then?: OnConsume
    }
  ): boolean {
    if (this.reachedEndOfText()) {
      return false
    }

    const { linePattern, then } = args

    let fullLine: string
    let lineWithoutTerminatingLineBreak: string

    // First, let's find the end of the current line
    for (let i = this.textIndex; i < this.entireText.length; i++) {
      const char = this.entireText[i]

      // Escaped line breaks don't end lines
      if (char === '\\') {
        i++
        continue
      }

      if (char === '\n') {
        fullLine = this.entireText.substring(this.textIndex, i + 1)
        lineWithoutTerminatingLineBreak = fullLine.slice(0, -1)
        break
      }
    }

    if (!fullLine) {
      // Well, we couldn't find a terminating line break! That must mean we're on the text's final line.
      fullLine = lineWithoutTerminatingLineBreak = this.remainingText
    }

    let captures: string[] = []

    if (linePattern) {
      const results = linePattern.exec(lineWithoutTerminatingLineBreak)

      if (!results) {
        return false
      }

      [ , ...captures] = results
    }

    if (args.if && !args.if(lineWithoutTerminatingLineBreak, ...captures)) {
      return false
    }

    this.advanceTextIndex(fullLine.length)

    if (then) {
      then(lineWithoutTerminatingLineBreak, ...captures)
    }

    return true
  }
}


interface ShouldConsumeLine {
  (line: string, ...captures: string[]): boolean
}

interface OnConsume {
  (text: string, ...captures: string[]): void
}
