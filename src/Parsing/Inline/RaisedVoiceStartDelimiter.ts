import { TokenizerSnapshot } from './TokenizerSnapshot'


export class RaisedVoiceStartDelimiter {
  initialTokenIndex: number

  private unspentDelimiterLength: number

  constructor(private delimiter: string, private snapshot: TokenizerSnapshot) {
    this.initialTokenIndex = this.snapshot.tokens.length
    this.unspentDelimiterLength = delimiter.length
  }

  pay(delimiterLength: number): void {
    this.unspentDelimiterLength -= 1
  }

  isFullySpent(): boolean {
    return this.unspentDelimiterLength <= 0
  }

  registerTokenInsertion(atIndex: number) {
    if (atIndex < this.initialTokenIndex) {
      this.initialTokenIndex += 1
    }
  }

  reset(): void {
    this.initialTokenIndex = this.snapshot.tokens.length
  }
}