import { TokenizableConvention } from './TokenizableConvention'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { TokenizerContext } from './TokenizerContext'


// TODO: Explain
export class RaisedVoiceContext extends TokenizerContext {

  static EMPHASIS_COST = 1
  static STRESS_COST = 2
  static STRESS_AND_EMPHASIS_TOGETHER_COST = (
    RaisedVoiceContext.STRESS_COST + RaisedVoiceContext.EMPHASIS_COST
  )

  initialTokenIndex: number
  unspentDelimiterLength: number

  private delimiter: string
  private convertDelimiterToPlainText: TreatDelimiterAsPlainText

  constructor(
    args: {
      delimeter: string
      treatDelimiterAsPlainText: TreatDelimiterAsPlainText
      snapshot: TokenizerSnapshot
    }
  ) {
    super(null, args.snapshot)

    this.delimiter = args.delimeter
    this.convertDelimiterToPlainText = args.treatDelimiterAsPlainText

    this.reset()
  }

  canOnlyAffordEmphasis(): boolean {
    return this.unspentDelimiterLength === RaisedVoiceContext.EMPHASIS_COST
  }

  canOnlyAffordStress(): boolean {
    return this.unspentDelimiterLength === RaisedVoiceContext.STRESS_COST
  }

  canAffordBothEmphasisAndStressTogether(): boolean {
    return this.unspentDelimiterLength >= RaisedVoiceContext.STRESS_AND_EMPHASIS_TOGETHER_COST
  }

  canAfford(delimiterLength: number): boolean {
    return this.unspentDelimiterLength >= delimiterLength
  }

  payForEmphasis(): void {
    this.pay(RaisedVoiceContext.EMPHASIS_COST)
  }

  payForStress(): void {
    this.pay(RaisedVoiceContext.STRESS_COST)
  }

  pay(delimiterLength: number): void {
    if (!this.canAfford(delimiterLength)) {
      throw new Error('Cannot afford: ' + delimiterLength)
    }

    this.unspentDelimiterLength -= delimiterLength
  }

  doIsteadOfTryingToCloseOuterContexts(): boolean {
    return false
  }

  doInsteadOfTryingToOpenUsualContexts(): boolean {
    return false
  }

  close(): void { }

  resolveWhenLeftUnclosed(): boolean {
    if (this.unspentDelimiterLength === this.delimiter.length) {
      this.convertDelimiterToPlainText(this.delimiter)
    }

    return true
  }

  reset(): void {
    super.reset()
    this.unspentDelimiterLength = this.delimiter.length
  }
}


interface TreatDelimiterAsPlainText {
  (delimiter: string): void
}
