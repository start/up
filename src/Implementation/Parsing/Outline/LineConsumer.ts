// This class helps incrementally consume a collection of lines (from start to finish)
// using regular expression patterns and predicates.
export class LineConsumer {
  private _countLinesConsumed = 0

  constructor(private lines: string[]) { }

  countLinesConsumed(): number {
    return this._countLinesConsumed
  }

  done(): boolean {
    return this._countLinesConsumed >= this.lines.length
  }

  remaining(): string[] {
    return this.lines.slice(this._countLinesConsumed)
  }

  advance(count: number): void {
    this._countLinesConsumed += count
  }

  // If the line doesn't satisfy the provided conditions, or if there are no more
  // lines, this method returns null.
  consumeLineIfMatches(
    linePattern: RegExp,
    options?: {
      andIf: (result: LineMatchResult) => boolean
    }
  ): LineMatchResult | null {
    if (this.done()) {
      return null
    }

    const line = this.nextRemainingLine()
    const result = linePattern.exec(line)

    if (result) {
      const lineMatchResult = {
        line,
        captures: result.slice(1)
      }

      if (!options || options.andIf(lineMatchResult)) {
        this.advance(1)
        return lineMatchResult
      }
    }

    return null
  }

  // This method consumes and returns the next remaining line. If there are
  // no remaining lines, this method throws an exception.
  consumeLine(): string {
    if (this.done()) {
      throw new Error('No remaining lines')
    }

    const line = this.nextRemainingLine()
    this.advance(1)

    return line
  }

  private nextRemainingLine(): string {
    return this.lines[this._countLinesConsumed]
  }
}


export interface LineMatchResult {
  line: string
  captures: string[]
}
