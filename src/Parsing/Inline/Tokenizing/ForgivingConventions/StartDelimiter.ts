import { Delimiter } from './Delimiter'


export class StartDelimiter extends Delimiter {
  constructor(
    delimiterText: string,
    public tokenIndex: number,
    // This optional parameter only for use in the `clone` method.
    unspentLength = delimiterText.length
  ) {
    super(delimiterText, unspentLength)
  }

  // A start delimiter is considered dangling if it went completely unmatched.
  isDangling(): boolean {
    return this.unspentLength === this.delimiterText.length
  }

  registerTokenInsertion(atIndex: number) {
    if (atIndex < this.tokenIndex) {
      this.tokenIndex += 1
    }
  }

  clone(): StartDelimiter {
    return new StartDelimiter(this.delimiterText, this.tokenIndex, this.unspentLength)
  }
}
