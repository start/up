// For now, emphasis and stress aren't determined until after tokenization, so we don't
// need to worry about keeping track of them here.
export class TokenizerContext {
  public isLinkOpen = false
  public isRevisionDeletionOpen = false
  public isRevisionInsertionOpen = false
  public countSpoilersOpen = 0
  public countFootnotesOpen = 0
  
  constructor() { }
  
  failed(): boolean {
    return (
      this.isLinkOpen
      || this.isRevisionDeletionOpen
      || this.isRevisionInsertionOpen
      || this.countSpoilersOpen > 0
      || this.countFootnotesOpen > 0
    )
  }
  
  withLinkOpen(): TokenizerContext {
    const copy = this.copyForNewOpenConvention()
    
    copy.isLinkOpen = true
    
    return copy
  }
  
  withRevisionDeletionOpen(): TokenizerContext {
    const copy = this.copyForNewOpenConvention()
    
    copy.isRevisionDeletionOpen = true
    
    return copy
  }
  
  withRevisionInsertionOpen(): TokenizerContext {
    const copy = this.copyForNewOpenConvention()
    
    copy.isRevisionInsertionOpen = true
    
    return copy
  }
  
  withAdditionalSpoilerOpen(): TokenizerContext {
    const copy = this.copyForNewOpenConvention()
    
    copy.countSpoilersOpen += 1
    
    return copy
  }
  
  withAdditionalFootnoteOpen(): TokenizerContext {
    const copy = this.copyForNewOpenConvention()
    
    copy.countSpoilersOpen += 1
    
    return copy
  }
  
  private copyForNewOpenConvention(): TokenizerContext {
    const copy = new TokenizerContext()
    
    copy.isLinkOpen = this.isLinkOpen
    copy.isRevisionDeletionOpen = this.isRevisionDeletionOpen
    copy.isRevisionInsertionOpen = this.isRevisionInsertionOpen
    copy.countSpoilersOpen = this.countSpoilersOpen
    copy.countFootnotesOpen = this.countFootnotesOpen
    
    return copy
  }
}

interface WithNewOpenConventionArgs {
  lengthAdvanceed: number
}