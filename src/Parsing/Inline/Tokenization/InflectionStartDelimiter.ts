export class InflectionStartDelimiter {
  constructor(
    public delimiterText: string,
    public tokenIndex: number,
    // This optional parameter is considered private. Please see the `clone` method below.
    public unspentLength = delimiterText.length) { }

  canAfford(cost: number): boolean {
    return this.unspentLength >= cost
  }

  canOnlyAfford(cost: number): boolean {
    return this.unspentLength === cost
  }

  pay(cost: number): void {
    this.unspentLength -= cost
  }

  // A start delimiter is considered dangling if it went completely unmatched.
  isDangling(): boolean {
    return this.unspentLength === this.delimiterText.length
  }

  isFullySpent(): boolean {
    return this.unspentLength === 0
  }

  registerTokenInsertion(atIndex: number) {
    if (atIndex < this.tokenIndex) {
      this.tokenIndex += 1
    }
  }

  clone(): InflectionStartDelimiter {
    return new InflectionStartDelimiter(this.delimiterText, this.tokenIndex, this.unspentLength)
  }
}
