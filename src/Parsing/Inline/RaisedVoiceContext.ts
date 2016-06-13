import { TokenizableConvention } from './TokenizableConvention'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { TokenizerContext } from './TokenizerContext'

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

  reset(): void {
    super.reset()
    this.countRemainingDelimiterChars = this.delimiterLength
  }
}
