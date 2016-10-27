export class StartDelimiter {
  constructor(
    public tokenIndex: number,
    public delimiterText: string,
    public remainingLength = delimiterText.length) {
  }

  get isUnused(): boolean {
    return this.remainingLength === this.delimiterText.length
  }

  get isFullyExhausted(): boolean {
    return this.remainingLength <= 0
  }

  shortenBy(length: number): void {
    this.remainingLength -= length
  }

  clone(): StartDelimiter {
    return new StartDelimiter(this.tokenIndex, this.delimiterText, this.remainingLength)
  }
}
