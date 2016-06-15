import { TokenizerSnapshot } from './TokenizerSnapshot'


export class RaisedVoiceStartDelimiter {
  private unspentDelimiterLength: number

  constructor(private delimiter: string, private snapshot: TokenizerSnapshot) {
    this.unspentDelimiterLength = delimiter.length
  }

  pay(delimiterLength: number): void {
    this.unspentDelimiterLength -= 1
  }

  isFullySpent(): boolean {
    return this.unspentDelimiterLength <= 0
  }
}