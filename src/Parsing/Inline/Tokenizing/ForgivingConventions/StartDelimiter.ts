import { Delimiter } from './Delimiter'


export class StartDelimiter extends Delimiter {
  constructor(
    delimiterText: string,
    public tokenIndex: number,
    // This optional parameter is only for use in the `clone` method.
    unspentLength = delimiterText.length
  ) {
    super(delimiterText, unspentLength)
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
