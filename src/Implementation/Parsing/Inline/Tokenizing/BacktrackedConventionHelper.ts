import { OpenConvention } from './OpenConvention'
import { ConventionVariation } from './ConventionVariation'


// We use this class to keep track of which conventions we've been forced to backtrack.
export class BacktrackedConventionHelper {
  private failedConventionsByMarkupIndex: {
    [markupIndex: number]: ConventionVariation[]
  } = {}

  registerFailure(failure: OpenConvention): void {
    const { markupIndex } = failure.tokenizerSnapshotWhenOpening

    this.failedConventionsByMarkupIndex[markupIndex] ??= []
    this.failedConventionsByMarkupIndex[markupIndex].push(failure.convention)
  }

  hasFailed(convention: ConventionVariation, markupIndex: number): boolean {
    const failedConventions = (this.failedConventionsByMarkupIndex[markupIndex] ?? [])
    return failedConventions.some(failedConvention => failedConvention === convention)
  }
}
