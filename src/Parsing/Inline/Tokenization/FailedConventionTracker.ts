import { TokenizableConvention } from './TokenizableConvention'
import { ConventionContext } from './ConventionContext'


export class FailedConventionTracker {
  private failedConventionsByTextIndex: FailedConventionsByTextIndex = {}
  
  registerFailure(contextOfFailedConvention: ConventionContext): void {
    const { convention, snapshot } = contextOfFailedConvention
    const { textIndex } = snapshot
    
    if (!this.failedConventionsByTextIndex[textIndex]) {
      this.failedConventionsByTextIndex[textIndex] = []
    }
    
    this.failedConventionsByTextIndex[textIndex].push(convention)
  }
  
  hasFailed(convention: TokenizableConvention, textIndex: number): boolean {
    const failedConventions = (this.failedConventionsByTextIndex[textIndex] || [])
    return failedConventions.some(failedConvention => failedConvention === convention)
  }
}


interface FailedConventionsByTextIndex {
  [textIndex: number]: TokenizableConvention[]
}
