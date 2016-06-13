import { TokenizableConvention } from './TokenizableConvention'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { TokenizerContext } from './TokenizerContext'


// TODO: Explain
export class RaisedVoiceContext extends TokenizerContext {
  initialTokenIndex: number
  countRemainingDelimiterChars: number

  private delimiter: string
  private convertDelimiterToPlainText: ConvertDelimiterToPlainText

  constructor(
    args: {
      delimeter: number
      convertDelimiterToPlainText: ConvertDelimiterToPlainText
      snapshot: TokenizerSnapshot
    }
  ) {
    super(null, args.snapshot)
    
    this.convertDelimiterToPlainText = args.convertDelimiterToPlainText
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
    if (this.countRemainingDelimiterChars === this.delimiter.length) {
      this.convertDelimiterToPlainText(this.delimiter)
    }

    return true
  }

  reset(): void {
    super.reset()
    this.countRemainingDelimiterChars = this.delimiter.length
  }
}


interface ConvertDelimiterToPlainText {
  (delimiter: string): void
}