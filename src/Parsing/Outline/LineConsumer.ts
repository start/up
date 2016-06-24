import { INPUT_LINE_BREAK, ESCAPER_CHAR } from '../Strings'


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

    const { textIndex, entireText } = this
    let fullLine: string
    let lineWithoutTerminatingLineBreak: string

    // First, let's find the end of the current line
    for (let i = textIndex; i < entireText.length; i++) {
      if (ESCAPER_CHAR === entireText[i]) {
        // Escaped line breaks don't end lines, so we'll just skip the next character, no matter what it is.
        i++
        continue
      }

      if (INPUT_LINE_BREAK === entireText.substr(i, INPUT_LINE_BREAK_LENGTH)) {
        fullLine = entireText.slice(textIndex, i + INPUT_LINE_BREAK_LENGTH)
        lineWithoutTerminatingLineBreak = fullLine.slice(0, -INPUT_LINE_BREAK_LENGTH)
        break
      }
    }

    if (!fullLine) {
      // Well, we couldn't find a terminating line break! That must mean we're on the text's final line.
      fullLine = lineWithoutTerminatingLineBreak = this.remainingText
    }

    const { linePattern, then } = args
    let captures: string[] = []

    if (linePattern) {
      const results = linePattern.exec(lineWithoutTerminatingLineBreak)

      if (!results) {
        return false
      }

      [, ...captures] = results
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


const INPUT_LINE_BREAK_LENGTH =
  INPUT_LINE_BREAK.length


export interface ShouldConsumeLine {
  (line: string, ...captures: string[]): boolean
}

export interface OnConsume {
  (line: string, ...captures: string[]): void
}
