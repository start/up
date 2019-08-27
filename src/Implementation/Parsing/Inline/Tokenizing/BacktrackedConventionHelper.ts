import { ConventionContext } from './ConventionContext'
import { ConventionVariation } from './ConventionVariation'


// We use this class to keep track of which conventions we've been forced to backtrack.
export class BacktrackedConventionHelper {
  private failedConventionsByMarkupIndex: FailedConventionsByTextIndex = {}

  registerFailure(contextOfFailedConvention: ConventionContext): void {
    const { convention, snapshot } = contextOfFailedConvention
    const { markupIndex } = snapshot

    if (!this.failedConventionsByMarkupIndex[markupIndex]) {
      this.failedConventionsByMarkupIndex[markupIndex] = []
    }

    this.failedConventionsByMarkupIndex[markupIndex].push(convention)
  }

  hasFailed(convention: ConventionVariation, markupIndex: number): boolean {
    const failedConventions = (this.failedConventionsByMarkupIndex[markupIndex] || [])
    return failedConventions.some(failedConvention => failedConvention === convention)
  }
}


interface FailedConventionsByTextIndex {
  [markupIndex: number]: ConventionVariation[]
}
