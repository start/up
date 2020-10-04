import { ConventionVariation } from './ConventionVariation'
import { TokenizerSnapshot } from './TokenizerSnapshot'


export class ConventionContext {
  constructor(
    public convention: ConventionVariation,
    public snapshot: TokenizerSnapshot,
    public startTokenIndex = snapshot.tokens.length) { }

  doIsteadOfTryingToCloseOuterConventions(): boolean {
    if (this.convention.insteadOfClosingOuterConventionsWhileOpen) {
      this.convention.insteadOfClosingOuterConventionsWhileOpen()
      return true
    }

    return false
  }

  doInsteadOfTryingToOpenRegularConventions(): boolean {
    if (this.convention.insteadOfOpeningRegularConventionsWhileOpen) {
      this.convention.insteadOfOpeningRegularConventionsWhileOpen()
      return true
    }

    return false
  }

  doInsteadOfFailingWhenLeftUnclosed(): boolean {
    if (this.convention.insteadOfFailingWhenLeftUnclosed) {
      this.convention.insteadOfFailingWhenLeftUnclosed()
      return true
    }

    return false
  }

  close(): void {
    if (this.convention.whenClosing) {
      this.convention.whenClosing(this)
    }
  }

  registerTokenInsertion(atIndex: number): void {
    if (atIndex < this.startTokenIndex) {
      this.startTokenIndex += 1
    }
  }

  clone(): ConventionContext {
    return new ConventionContext(this.convention, this.snapshot, this.startTokenIndex)
  }
}
