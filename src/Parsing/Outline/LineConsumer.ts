import { INPUT_LINE_BREAK, ESCAPER_CHAR } from '../Strings'


export class LineConsumer {
  private _countLinesConsumed = 0
  private _remainingLines: string[]

  constructor(textOrLines: string | string[]) {
    if (typeof textOrLines === "string") {
      this._remainingLines = getLines(textOrLines)
    } else {
      this._remainingLines = textOrLines
    }
  }

  get countLinesConsumed(): number {
    return this._countLinesConsumed
  }

  get remainingLines(): string[] {
    return this._remainingLines
  }

  skipLines(count: number): void {
    this._remainingLines.splice(0, count)
    this._countLinesConsumed += count
  }

  reachedEndOfText(): boolean {
    return !this._remainingLines.length
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

    const line = this._remainingLines[0]
    const { linePattern, then } = args
    let captures: string[] = []

    if (linePattern) {
      const results = linePattern.exec(line)

      if (!results) {
        return false
      }

      [, ...captures] = results
    }

    if (args.if && !args.if(line, ...captures)) {
      return false
    }

    this.skipLines(1)

    if (then) {
      then(line, ...captures)
    }

    return true
  }

  getCopyStartingAtCurrentLine(): LineConsumer {
    return new LineConsumer(this._remainingLines)
  }
}


function getLines(text: string): string[] {
  let lines: string[] = []
  let textIndexOfCurrentLine = 0

  LineLoop: while (textIndexOfCurrentLine < text.length) {
    let lineWithoutTerminatingLineBreak: string

    for (let i = textIndexOfCurrentLine; i < text.length; i++) {
      if (ESCAPER_CHAR === text[i]) {
        // Escaped line breaks don't end lines, so we'll just skip the next character, no matter what it is.
        i++
        continue
      }

      if (INPUT_LINE_BREAK === text.substr(i, INPUT_LINE_BREAK_LENGTH)) {
        lineWithoutTerminatingLineBreak = text.slice(textIndexOfCurrentLine, i)
        lines.push(lineWithoutTerminatingLineBreak)
        textIndexOfCurrentLine = i + INPUT_LINE_BREAK_LENGTH

        continue LineLoop
      }
    }

    // Well, we couldn't find a terminating line break! That must mean we're on the text's final line.
    lines.push(text.slice(textIndexOfCurrentLine))
    break
  }

  return lines
}


const INPUT_LINE_BREAK_LENGTH =
  INPUT_LINE_BREAK.length


export interface ShouldConsumeLine {
  (line: string, ...captures: string[]): boolean
}

export interface OnConsume {
  (line: string, ...captures: string[]): void
}
