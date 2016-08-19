import { Convention } from './Convention'
import { TokenizerSnapshot } from './TokenizerSnapshot'


export class ConventionContext {
  constructor(
    public convention: Convention,
    public snapshot: TokenizerSnapshot,
    public startTokenIndex = snapshot.tokens.length) { }

  doIsteadOfTryingToCloseOuterConventions(): boolean {
    if (this.convention.insteadOfClosingOuterConventionsWhileOpen) {
      this.convention.insteadOfClosingOuterConventionsWhileOpen(this)
      return true
    }

    return false
  }

  doInsteadOfTryingToOpenRegularConventions(): boolean {
    if (this.convention.insteadOfOpeningNormalConventionsWhileOpen) {
      this.convention.insteadOfOpeningNormalConventionsWhileOpen(this)
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
    if (this.convention.whenClosing) {
      this.convention.whenClosing(this)
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
