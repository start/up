import { TokenizableConvention } from './TokenizableConvention'
import { ConventionContextSnapshot } from './ConventionContextSnapshot'
import { TokenizerSnapshot } from './TokenizerSnapshot'

export class ConventionContext {
  startTokenIndex: number

  constructor(public convention: TokenizableConvention, public snapshot: TokenizerSnapshot) {
    this.startTokenIndex = snapshot.textIndex
    this.snapshot = snapshot
    this.startTokenIndex = this.snapshot.tokens.length
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
    if (args.atIndex < this.startTokenIndex) {
      this.startTokenIndex += 1
    }
  }

  getCurrentSnapshot(): ConventionContextSnapshot {
    return new ConventionContextSnapshot(this.startTokenIndex)
  }

  reset(snapshot: ConventionContextSnapshot): void {
    this.startTokenIndex = snapshot.startTokenIndex
  }
}
