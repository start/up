import { TokenizerSnapshot } from './TokenizerSnapshot'


export class RaisedVoiceStartDelimiter {
  tokenIndex: number
  unspentDelimiterLength: number

  constructor(public delimiter: string, private snapshot: TokenizerSnapshot) {
    this.tokenIndex = this.snapshot.tokens.length
    this.unspentDelimiterLength = delimiter.length
  }

  canAfford(delimiterLength: number): boolean {
    return this.unspentDelimiterLength >= delimiterLength
  }

  canOnlyAfford(delimiterLength: number): boolean {
    return this.unspentDelimiterLength === delimiterLength
  }

  pay(delimiterLength: number): void {
    this.unspentDelimiterLength -= 1
  }

  isUnused(): boolean {
    return this.unspentDelimiterLength === this.delimiter.length
  }

  isFullySpent(): boolean {
    return this.unspentDelimiterLength <= 0
  }

  registerTokenInsertion(atIndex: number) {
    if (atIndex < this.tokenIndex) {
      this.tokenIndex += 1
    }
  }

  reset(): void {
    this.tokenIndex = this.snapshot.tokens.length
  }
}