import { TokenizerSnapshot } from './TokenizerSnapshot'


export class RaisedVoiceStartDelimiter {
  tokenIndex: number
  unspentLength: number

  constructor(public text: string, private snapshot: TokenizerSnapshot) {
    this.tokenIndex = this.snapshot.tokens.length
    this.unspentLength = text.length
  }

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
    return this.unspentLength === this.text.length
  }

  isFullySpent(): boolean {
    return this.unspentLength === 0
  }

  registerTokenInsertion(atIndex: number) {
    if (atIndex < this.tokenIndex) {
      this.tokenIndex += 1
    }
  }

  reset(): void {
    this.tokenIndex = this.snapshot.tokens.length
    this.unspentLength = Text.length
  }
}