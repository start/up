import { Delimiter } from './Delimiter'
import { EndDelimiter } from './EndDelimiter'

// Why is `tokenIndex` unique to `StartDelimiter`?
//
// End delimiters are fully handled as soon as they are encountered, so there's no need
// to keep track of their token index. For more information, see the comments in the
// `ForgivingConventionHandler` class.
export class StartDelimiter extends Delimiter {
  constructor(public tokenIndex: number, delimiterText: string, unspentLength = delimiterText.length) {
    super(delimiterText, unspentLength)
  }

  get isUnused(): boolean {
    return this.unspentLength === this.delimiterText.length
  }

  registerTokenInsertion(atIndex: number) {
    if (atIndex < this.tokenIndex) {
      this.tokenIndex += 1
    }
  }

  cancelOutAndGetCommonUnspentLength(endDelimiter: EndDelimiter): number {
    const commonUnspentLength =
      Math.min(this.unspentLength, endDelimiter.unspentLength)

    this.pay(commonUnspentLength)
    endDelimiter.pay(commonUnspentLength)

    return commonUnspentLength
  }

  clone(): StartDelimiter {
    return new StartDelimiter(this.tokenIndex, this.delimiterText, this.unspentLength)
  }
}
