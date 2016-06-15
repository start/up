import { TokenizableConvention } from './TokenizableConvention'
import { TokenizerSnapshot } from './TokenizerSnapshot'

export class TokenizerContext {
  initialTokenIndex: number

  constructor(public convention: TokenizableConvention, public snapshot: TokenizerSnapshot) {
    this.initialTokenIndex = snapshot.textIndex
    this.snapshot = snapshot
    this.initialTokenIndex = this.snapshot.tokens.length
  }

  doIsteadOfTryingToCloseOuterContexts(): boolean {
    if (this.convention.insteadOfTryingToCloseOuterContexts) {
      this.convention.insteadOfTryingToCloseOuterContexts()
      return true
    }

    return false
  }

  doInsteadOfTryingToOpenUsualContexts(): boolean {
    if (this.convention.insteadOfTryingToOpenUsualConventions) {
      this.convention.insteadOfTryingToOpenUsualConventions()
      return true
    }

    return false
  }

  close(): void {
    if (this.convention.onClose) {
      this.convention.onClose(this)
    }
  }

  resolveWhenLeftUnclosed(): boolean {
    if (this.convention.resolveWhenLeftUnclosed) {
      this.convention.resolveWhenLeftUnclosed(this)
      return true
    }

    return false
  }

  registerTokenInsertion(args: { atIndex: number }) {
    if (args.atIndex < this.initialTokenIndex) {
      this.initialTokenIndex += 1
    }
  }

  reset(): void {
    this.initialTokenIndex = this.snapshot.tokens.length
  }
}
