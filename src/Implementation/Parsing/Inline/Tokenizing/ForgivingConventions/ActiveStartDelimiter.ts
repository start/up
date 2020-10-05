export class ActiveStartDelimiter {
  constructor(
    public tokenIndex: number,
    public delimiterText: string,
    public remainingLength = delimiterText.length) {
  }

  isUnused(): boolean {
    return this.remainingLength === this.delimiterText.length
  }

  isFullyExhausted(): boolean {
    return this.remainingLength <= 0
  }

  shortenBy(length: number): void {
    this.remainingLength -= length
  }

  clone(): ActiveStartDelimiter {
    return new ActiveStartDelimiter(this.tokenIndex, this.delimiterText, this.remainingLength)
  }
}
