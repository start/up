export class LineConsumer {
  private _countLinesConsumed = 0

  constructor(private lines: string[]) { }

  get countLinesConsumed(): number {
    return this._countLinesConsumed
  }

  getRemainingLines(): string[] {
    return this.lines.slice(this._countLinesConsumed)
  }

  skipLines(count: number): void {
    this._countLinesConsumed += count
  }

  done(): boolean {
    return this._countLinesConsumed >= this.lines.length
  }

  consume(
    args: {
      linePattern?: RegExp,
      if?: ShouldConsumeLine,
      then?: OnConsume
    }
  ): boolean {
    if (this.done()) {
      return false
    }

    const { linePattern, then } = args
    let captures: string[] = []

    const line = this.lines[this._countLinesConsumed]

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
}


export interface ShouldConsumeLine {
  (line: string, ...captures: string[]): boolean
}

export interface OnConsume {
  (line: string, ...captures: string[]): void
}
