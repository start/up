import { Delimiter } from './Delimiter'

// Why is `tokenIndex` unique to `StartDelimiter`?
//
// End delimiters are fully handled as soon as they are encountered, so there's no need
// to keep track of their token index. For more information, see the comments in the
// `ForgivingConventionHandler` class.
export class StartDelimiter extends Delimiter {
  constructor(public tokenIndex: number, delimiterText: string, remainingLength = delimiterText.length) {
    super(delimiterText, remainingLength)
  }

  get isUnused(): boolean {
    return this.remainingLength === this.delimiterText.length
  }

  clone(): StartDelimiter {
    return new StartDelimiter(this.tokenIndex, this.delimiterText, this.remainingLength)
  }
}
