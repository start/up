import { OpenConvention } from './OpenConvention'
import { ConventionDefinition } from './ConventionDefinition'


// We use this class to keep track of which conventions we've been forced to backtrack.
export class BacktrackedConventionHelper {
  private failedConventionsByMarkupIndex: {
    [markupIndex: number]: ConventionDefinition[]
  } = {}

  registerFailure(failure: OpenConvention): void {
    const { markupIndex } = failure.tokenizerSnapshotWhenOpening

    this.failedConventionsByMarkupIndex[markupIndex] ??= []
    this.failedConventionsByMarkupIndex[markupIndex].push(failure.definition)
  }

  hasFailed(convention: ConventionDefinition, markupIndex: number): boolean {
    const failedConventions = (this.failedConventionsByMarkupIndex[markupIndex] ?? [])
    return failedConventions.some(failedConvention => failedConvention === convention)
  }
}
