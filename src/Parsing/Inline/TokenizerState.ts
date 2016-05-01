// For now, emphasis and stress aren't determined until after tokenization, so we don't
// need to worry about keeping track of them here.
export class TokenizerState {
  public isLinkOpen = false
  public isRevisionDeletionOpen = false
  public isRevisionInsertionOpen = false
  public countSpoilersOpen = 0
  public countFootnotesOpen = 0
  
  failed(): boolean {
    return (
      this.isLinkOpen
      || this.isRevisionDeletionOpen
      || this.isRevisionInsertionOpen
      || this.countSpoilersOpen > 0
      || this.countFootnotesOpen > 0
    )
  }
  
  private clone(): TokenizerState {
    const clone = new TokenizerState()
    
    clone.isLinkOpen = this.isLinkOpen
    clone.isRevisionDeletionOpen = this.isRevisionDeletionOpen
    clone.isRevisionInsertionOpen = this.isRevisionInsertionOpen
    clone.countSpoilersOpen = this.countSpoilersOpen
    clone.countFootnotesOpen = this.countFootnotesOpen
    
    return clone
  }
}