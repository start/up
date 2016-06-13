import { TokenizableConvention } from './TokenizableConvention'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { TokenizerContext } from './TokenizerContext'


// TODO: Explain
export class RaisedVoiceContext extends TokenizerContext {
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