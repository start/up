// This class helps incrementally consume a collection of lines (from start to finish)
// using regular expression patterns and predicates.
export class LineConsumer {
  private _countLinesConsumed = 0

  constructor(private lines: string[]) { }

  get countLinesConsumed(): number {
    return this._countLinesConsumed
  }

  remaining(): string[] {
    return this.lines.slice(this._countLinesConsumed)
  }

  skipLines(count: number): void {
    this._countLinesConsumed += count
  }

  done(): boolean {
    return this._countLinesConsumed >= this.lines.length
  }

  // This method consumes the next remaining line if it matches `linePattern`.
  consumeLineIfMatches(linePattern: RegExp): LineMatchResult | null {
    const line = this.nextRemainingLine
    const result = linePattern.exec(line)

    if (!result) {
      return null
    }

    this.skipLines(1)

    return {
      line: result[0],
      captures: result.slice(1)
    }
  }


  // This method consumes the next remaining line if it matches `linePattern`, then
  // returns the result of `RegExp.exec`. If the line doesn't match `linePattern`,
  // this method returns null.
  consumeLine(): string {
    const line = this.nextRemainingLine    
    this.skipLines(1)

    return line
  }

  private get nextRemainingLine(): string {
    return this.lines[this._countLinesConsumed]
  }
}


interface LineMatchResult {
  line: string
  captures: string[]
}
