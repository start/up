export class TextConsumer {
  public countCharsConsumed = 0;
  public index = 0;
  private countUnclosedParens = 0;
  private countUnclosedSquareBrackes = 0;
  public isCurrentCharEscaped = false;
  public unconsumedText = '';
  
  
  constructor(private text: string) {
    if (!this.hasExaminedAllText()) {
      this.handleEscaping()
    }
  }
  
  
  remainingText(): string {
    return this.remainingTextBeyond('')
  }
  
  
  remainingTextBeyond(needle: string): string {
    return this.text.slice(this.index + needle.length)
  }
  
  
  isMatch(needle: string) {
    return !this.isCurrentCharEscaped
      && (needle === this.text.substr(this.index, needle.length))
      && this.areAllRelevantBracketsClosed(needle)
  }
  
  
  advance(): void {
    this.updateUnclosedBracketCount()
    this.unconsumedText += this.currentChar()
    this.index += 1
    this.handleEscaping()
  }
  
  
  ignoreAndConsume(count: number): void {
    this.index += count
    this.countCharsConsumed = this.index
    this.handleEscaping()
  }
  
  
  hasExaminedAllText(): boolean {
    return this.index >= this.text.length
  }
  
  
  private currentChar(): string {
    return this.text[this.index]
  }
  
  public skippedText() {
    return this.unconsumedText
  }
  
  
  public consumeSkippedTextThenIgnoreNext(toDiscard: string|number): string {
    const skippedText = this.skippedText()
    
    this.unconsumedText = ''
    
    const discardLenth = (
      typeof toDiscard === "string"
      ? toDiscard.length
      : toDiscard
    )
    
    // We subtract 1 because because we're consuming all *previous* text.
    this.countCharsConsumed = this.index - 1 + discardLenth
    
    return skippedText;
  }
  
  
  public consumeSkippedText() {
    return this.consumeSkippedTextThenIgnoreNext('')
  }
  
  
  private handleEscaping() {
    this.isCurrentCharEscaped = !this.isCurrentCharEscaped && (this.currentChar() === '\\')
    if (this.isCurrentCharEscaped) {
      this.index +=1
    }
  }
  

  private updateUnclosedBracketCount() {
    switch (this.currentChar()) {
      case '(':
        this.countUnclosedParens += 1
        break
      case ')':
        this.countUnclosedParens = Math.max(0, this.countUnclosedParens - 1)
        break
      case '[':
        this.countUnclosedSquareBrackes += 1
        break
      case ']':
        this.countUnclosedSquareBrackes = Math.max(0, this.countUnclosedSquareBrackes - 1)
        break
    }
  }
  

  private areAllRelevantBracketsClosed(needle: string): boolean { 
    if (countOf(')', needle) && this.countUnclosedParens) {
      return false;
    }
    
    if (countOf(']', needle) && this.countUnclosedSquareBrackes) {
      return false;
    }
    
    return true
  }
}


function countOf(char: string, haystack: string): number {
  const matches: RegExpMatchArray = haystack.match(new RegExp(`\\${char}`, 'g')) || [];
  return matches.length
}