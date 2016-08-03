import { Convention } from './Convention'
import { ConventionContext } from './ConventionContext'


export class FailedConventionTracker {
  private failedConventionsByMarkupIndex: FailedConventionsByTextIndex = {}

  registerFailure(contextOfFailedConvention: ConventionContext): void {
    const { convention, snapshot } = contextOfFailedConvention
    const { markupIndex } = snapshot

    if (!this.failedConventionsByMarkupIndex[markupIndex]) {
      this.failedConventionsByMarkupIndex[markupIndex] = []
    }

    this.failedConventionsByMarkupIndex[markupIndex].push(convention)
  }

  hasFailed(convention: Convention, markupIndex: number): boolean {
    const failedConventions = (this.failedConventionsByMarkupIndex[markupIndex] || [])
    return failedConventions.some(failedConvention => failedConvention === convention)
  }
}


interface FailedConventionsByTextIndex {
  [markupIndex: number]: Convention[]
}
