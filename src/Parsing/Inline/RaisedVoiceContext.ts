import { TokenizableConvention } from './TokenizableConvention'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { TokenizerContext } from './TokenizerContext'


// TODO: Explain
export class RaisedVoiceContext extends TokenizerContext {
  initialTokenIndex: number
  countRemainingDelimiterChars: number

  constructor(
    public convention: TokenizableConvention,
    public snapshot: TokenizerSnapshot,
    private delimiterLength: number
  ) {
    super(convention, snapshot)
    this.reset()
  }

  doIsteadOfTryingToCloseOuterContexts(): boolean {
    return false
  }

  doInsteadOfTryingToOpenUsualContexts(): boolean {
    return false
  }

  close(): void {
    if (this.countRemainingDelimiterChars === this.delimiterLength) {
      
    }
  }

  resolveWhenLeftUnclosed(): boolean {
    return false
  }

  reset(): void {
    super.reset()
    this.countRemainingDelimiterChars = this.delimiterLength
  }
}
