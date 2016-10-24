import { Delimiter } from './Delimiter'


export class StartDelimiter extends Delimiter {
  constructor(
    // Why is `tokenIndex` unique to `StartDelimiter`?
    //
    // End delimiters are fully handled as soon as they are encountered, so there's no need
    // to keep track of their token index. For more information, see the comments in the
    // `ForgivingConventionHandler` class.
    public tokenIndex: number,
    delimiterText: string,
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
    return new StartDelimiter(this.tokenIndex, this.delimiterText, this.unspentLength)
  }
}
