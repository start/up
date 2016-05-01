// For now, emphasis and stress aren't determined until after tokenization, so we don't
// need to worry about keeping track of them here.
export class TokenizerState {
  public isLinkOpen = false
  public isRevisionDeletionOpen = false
  public isRevisionInsertionOpen = false
  public countSpoilersOpen = 0
  public countFootnotesOpen = 0
  public lengthAdvanced = 0
  
  constructor(public remainingText: string) { }
  
  done(): boolean {
    return !this.remainingText
  }
  
  failed(): boolean {
    return (
      this.isLinkOpen
      || this.isRevisionDeletionOpen
      || this.isRevisionInsertionOpen
      || this.countSpoilersOpen > 0
      || this.countFootnotesOpen > 0
    )
  }
  
  advance(length: number) {
    this.remainingText = this.remainingText.substr(length)
  }
  
  withLinkOpen(args: WithNewOpenConventionArgs): TokenizerState {
    const copy = this.copyForNewOpenConvention(args)
    
    copy.isLinkOpen = true
    
    return copy
  }
  
  withRevisionDeletionOpen(args: WithNewOpenConventionArgs): TokenizerState {
    const copy = this.copyForNewOpenConvention(args)
    
    copy.isRevisionDeletionOpen = true
    
    return copy
  }
  
  withRevisionInsertionOpen(args: WithNewOpenConventionArgs): TokenizerState {
    const copy = this.copyForNewOpenConvention(args)
    
    copy.isRevisionInsertionOpen = true
    
    return copy
  }
  
  withAdditionalSpoilerOpen(args: WithNewOpenConventionArgs): TokenizerState {
    const copy = this.copyForNewOpenConvention(args)
    
    copy.countSpoilersOpen += 1
    
    return copy
  }
  
  withAdditionalFootnoteOpen(args: WithNewOpenConventionArgs): TokenizerState {
    const copy = this.copyForNewOpenConvention(args)
    
    copy.countSpoilersOpen += 1
    
    return copy
  }
  
  private copyForNewOpenConvention(args: WithNewOpenConventionArgs): TokenizerState {
    const copy = new TokenizerState(this.remainingText)
    
    copy.isLinkOpen = this.isLinkOpen
    copy.isRevisionDeletionOpen = this.isRevisionDeletionOpen
    copy.isRevisionInsertionOpen = this.isRevisionInsertionOpen
    copy.countSpoilersOpen = this.countSpoilersOpen
    copy.countFootnotesOpen = this.countFootnotesOpen
    
    // The copy should start with a `lengthAdvanced` of 0.
    copy.advance(args.lengthAdvanceed)
    copy.lengthAdvanced = 0
    
    return copy
  }
}

interface WithNewOpenConventionArgs {
  lengthAdvanceed: number
}