import { TokenizableConvention } from './TokenizableConvention'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { TokenizerContext } from './TokenizerContext'
import { OnConventionEvent } from './OnConventionEvent'


// TODO: Explain
export class RaisedVoiceContext extends TokenizerContext {

  static EMPHASIS_COST = 1
  static STRESS_COST = 2
  static STRESS_AND_EMPHASIS_TOGETHER_COST = (
    RaisedVoiceContext.STRESS_COST + RaisedVoiceContext.EMPHASIS_COST)

  initialTokenIndex: number

  private openingDelimiter: string
  private unspentOpeningDelimiterLength: number
  private treatDelimiterAsPlainText: OnConventionEvent

  constructor(
    args: {
      delimiter: string
      treatDelimiterAsPlainText: OnConventionEvent
      snapshot: TokenizerSnapshot
    }
  ) {
    super(null, args.snapshot)

    this.openingDelimiter = args.delimiter
    this.treatDelimiterAsPlainText = args.treatDelimiterAsPlainText
    this.unspentOpeningDelimiterLength = this.openingDelimiter.length
  }

  doIsteadOfTryingToCloseOuterContexts(): boolean {
    return false
  }

  doInsteadOfTryingToOpenUsualContexts(): boolean {
    return false
  }

  close(): void { }

  resolveWhenLeftUnclosed(): boolean {
    if (this.unspentOpeningDelimiterLength === this.openingDelimiter.length) {
      this.treatDelimiterAsPlainText(this)
    }

    return true
  }

  reset(): void {
    super.reset()
    this.unspentOpeningDelimiterLength = this.openingDelimiter.length
  }

  isFullySpent(): boolean {
    return !this.unspentOpeningDelimiterLength
  }

  canAffordEmphasis(): boolean {
    return this.unspentOpeningDelimiterLength >= RaisedVoiceContext.EMPHASIS_COST
  }

  canAffordStress(): boolean {
    return this.unspentOpeningDelimiterLength >= RaisedVoiceContext.STRESS_COST
  }

  canOnlyAffordEmphasis(): boolean {
    return this.unspentOpeningDelimiterLength === RaisedVoiceContext.EMPHASIS_COST
  }

  canOnlyAffordStress(): boolean {
    return this.unspentOpeningDelimiterLength === RaisedVoiceContext.STRESS_COST
  }

  canAffordBothEmphasisAndStressTogether(): boolean {
    return this.unspentOpeningDelimiterLength >= RaisedVoiceContext.STRESS_AND_EMPHASIS_TOGETHER_COST
  }

  payForEmphasis(): void {
    this.pay(RaisedVoiceContext.EMPHASIS_COST)
  }

  payForStress(): void {
    this.pay(RaisedVoiceContext.STRESS_COST)
  }

  // When matching delimiters each have 3 or more characters to spend, their contents become stressed and emphasized,
  // and they cancel out as many of each other's delimiter characters as possible.
  //
  // Therefore, surrounding text with 3 asterisks has the same effect as surrounding text with 10.
  //
  // To be clear, any unmatched delimiter characters are *not* canceled, and they remain available to be subsequently
  // matched by other delimiters.
  //
  // This method returns the number of characters both delimiters have in common. 
  payForEmphasisAndStressTogetherAndGetCost(closingDelimiterLength: number): number {
    const lengthInCommon =
      Math.min(this.unspentOpeningDelimiterLength, closingDelimiterLength)

    this.pay(lengthInCommon)

    return lengthInCommon
  }

  private canAfford(delimiterLength: number): boolean {
    return this.unspentOpeningDelimiterLength >= delimiterLength
  }

  private pay(delimiterLength: number): void {
    if (!this.canAfford(delimiterLength)) {
      throw new Error('Cannot afford: ' + delimiterLength)
    }

    this.unspentOpeningDelimiterLength -= delimiterLength
  }
}
