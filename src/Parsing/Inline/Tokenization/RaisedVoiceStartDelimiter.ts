export class RaisedVoiceStartDelimiter {
  constructor(public delimiterText: string, public tokenIndex: number, public unspentLength = delimiterText.length) { }

  canAfford(cost: number): boolean {
    return this.unspentLength >= cost
  }

  canOnlyAfford(cost: number): boolean {
    return this.unspentLength === cost
  }

  pay(cost: number): void {
    this.unspentLength -= cost
  }

  isUnused(): boolean {
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

  clone(): RaisedVoiceStartDelimiter {
    return new RaisedVoiceStartDelimiter(this.delimiterText, this.tokenIndex, this.unspentLength)
  }
}
