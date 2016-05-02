const NOT_WHITESPACE_PATTERN = /\S/

// For now, emphasis and stress aren't determined until after tokenization, so we don't
// need to worry about keeping track of them here.
export class TokenizerContext {
  public isInlineCodeOpen = false
  public isLinkOpen = false
  public isRevisionDeletionOpen = false
  public isRevisionInsertionOpen = false
  public countSpoilersOpen = 0
  public countFootnotesOpen = 0
  public lengthAdvanced = 0
  public remainingText: string
  public currentChar: string
  
  constructor(private entireText: string, private initialIndex = 0) {
    this.dirty()
  }
  
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
  
  withInlineCodeOpen(args: WithNewOpenConventionArgs): TokenizerContext {
    const copy = this.copyForNewOpenConvention(args)
    
    copy.isInlineCodeOpen = true
    
    return copy
  }
  
  withLinkOpen(args: WithNewOpenConventionArgs): TokenizerContext {
    const copy = this.copyForNewOpenConvention(args)
    
    copy.isLinkOpen = true
    
    return copy
  }
  
  withRevisionDeletionOpen(args: WithNewOpenConventionArgs): TokenizerContext {
    const copy = this.copyForNewOpenConvention(args)
    
    copy.isRevisionDeletionOpen = true
    
    return copy
  }
  
  withRevisionInsertionOpen(args: WithNewOpenConventionArgs): TokenizerContext {
    const copy = this.copyForNewOpenConvention(args)
    
    copy.isRevisionInsertionOpen = true
    
    return copy
  }
  
  withAdditionalSpoilerOpen(args: WithNewOpenConventionArgs): TokenizerContext {
    const copy = this.copyForNewOpenConvention(args)
    
    copy.countSpoilersOpen += 1
    
    return copy
  }
  
  withAdditionalFootnoteOpen(args: WithNewOpenConventionArgs): TokenizerContext {
    const copy = this.copyForNewOpenConvention(args)
    
    copy.countSpoilersOpen += 1
    
    return copy
  }
  
  advance(length: number): void {
    this.lengthAdvanced += length
    this.dirty()  
  }
  
  isTouchingEndOfNonWhitespace(): boolean {
    const previousChar = this.remainingText[this.currentIndex() - 1]
    
    return NOT_WHITESPACE_PATTERN.test(previousChar)
  }
  
  isTouchingBeginningOfNonWhitespace(args?: { countCharsToLookAhead: number }): boolean {
    args = args || { countCharsToLookAhead: 0 }
    const relevantChar = this.remainingText[this.currentIndex() + args.countCharsToLookAhead]
    
    return NOT_WHITESPACE_PATTERN.test(relevantChar)
  }
  
  private currentIndex(): number {
    return this.initialIndex + this.lengthAdvanced
  }
  
  private copyForNewOpenConvention(args: WithNewOpenConventionArgs): TokenizerContext {
    const copy = new TokenizerContext(this.entireText, this.currentIndex())
    
    copy.isLinkOpen = this.isLinkOpen
    copy.isRevisionDeletionOpen = this.isRevisionDeletionOpen
    copy.isRevisionInsertionOpen = this.isRevisionInsertionOpen
    copy.countSpoilersOpen = this.countSpoilersOpen
    copy.countFootnotesOpen = this.countFootnotesOpen
    
    // We don't copy `this.isInlineCodeOpen`. It will always be false when this method is called,
    // because no new conventions can be opened inside of inline code.
    
    copy.advance(args.startTokenLength)
    copy.dirty()
    
    return copy
  }
  
  private dirty(): void {
    this.remainingText = this.entireText.substr(this.currentIndex())
    this.currentChar = this.remainingText[0]
  }
}

interface WithNewOpenConventionArgs {
  startTokenLength: number
}