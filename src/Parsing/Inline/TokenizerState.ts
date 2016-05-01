// For now, emphasis and stress aren't determined until after tokenization, so we don't
// need to worry about keeping track of them here.
export class TokenizerState {
  public isLinkOpen = false
  public isRevisionDeletionOpen = false
  public isRevisionInsertionOpen = false
  public countSpoilersOpen = 0
  public countFootnotesOpen = 0
  
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
    const clone = this.cloneForNewOpenConvention(args)
    
    clone.isLinkOpen = true
    clone.advance(length)
    
    return clone
  }
  
  withRevisionDeletionOpen(args: WithNewOpenConventionArgs): TokenizerState {
    const clone = this.cloneForNewOpenConvention(args)
    
    clone.isRevisionDeletionOpen = true
    
    return clone
  }
  
  withRevisionInsertionOpen(args: WithNewOpenConventionArgs): TokenizerState {
    const clone = this.cloneForNewOpenConvention(args)
    
    clone.isRevisionInsertionOpen = true
    
    return clone
  }
  
  withAdditionalSpoilerOpen(args: WithNewOpenConventionArgs): TokenizerState {
    const clone = this.cloneForNewOpenConvention(args)
    
    clone.countSpoilersOpen += 1
    
    return clone
  }
  
  withAdditionalFootnoteOpen(args: WithNewOpenConventionArgs): TokenizerState {
    const clone = this.cloneForNewOpenConvention(args)
    
    clone.countSpoilersOpen += 1
    
    return clone
  }
  
  private cloneForNewOpenConvention(args: WithNewOpenConventionArgs): TokenizerState {
    const clone = this.clone()
    
    clone.advance(args.lengthAdvanceed)
    
    return clone
  }
  
  
  private clone(): TokenizerState {
    const clone = new TokenizerState(this.remainingText)
    
    clone.remainingText = this.remainingText
    clone.isLinkOpen = this.isLinkOpen
    clone.isRevisionDeletionOpen = this.isRevisionDeletionOpen
    clone.isRevisionInsertionOpen = this.isRevisionInsertionOpen
    clone.countSpoilersOpen = this.countSpoilersOpen
    clone.countFootnotesOpen = this.countFootnotesOpen
    
    return clone
  }
}

interface WithNewOpenConventionArgs {
  lengthAdvanceed: number
}