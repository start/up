import { TokenizableConvention } from './TokenizableConvention'
import { TokenizerSnapshot } from './TokenizerSnapshot'


export class ConventionContext {
  constructor(
    public convention: TokenizableConvention,
    public snapshot: TokenizerSnapshot,
    public startTokenIndex = snapshot.tokens.length) { }

  doIsteadOfTryingToCloseOuterContexts(): boolean {
    if (this.convention.insteadOfTryingToCloseOuterContexts) {
      this.convention.insteadOfTryingToCloseOuterContexts(this)
      return true
    }

    return false
  }

  doInsteadOfTryingToOpenUsualContexts(): boolean {
    if (this.convention.insteadOfTryingToOpenUsualConventions) {
      this.convention.insteadOfTryingToOpenUsualConventions(this)
      return true
    }

    return false
  }

  doInsteadOfFailingWhenLeftUnclosed(): boolean {
    if (this.convention.insteadOfFailingWhenLeftUnclosed) {
      this.convention.insteadOfFailingWhenLeftUnclosed(this)
      return true
    }

    return false
  }

  close(): void {
    if (this.convention.onClose) {
      this.convention.onClose(this)
    }
  }

  registerTokenInsertion(args: { atIndex: number }) {
    if (args.atIndex < this.startTokenIndex) {
      this.startTokenIndex += 1
    }
  }

  clone(): ConventionContext {
    return new ConventionContext(this.convention, this.snapshot, this.startTokenIndex)
  }
}
