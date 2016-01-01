export class TextConsumer {
  private index = 0;
  private countUnclosedParens = 0;
  private countUnclosedSquareBrackes = 0;
  
  
  constructor(private text: string) {
    if (text) {
      this.updateUnclosedBracketCount()
    }
  }
  
  
  remaining() {
    return this.text.slice(this.index)
  }
  
  
  isMatch(needle: string) {
    if (this.isEscaped()) {
      return false
    }
    
    return (needle === this.text.substr(this.index, needle.length)) &&  this.areAllRelevantBracketsClosed(needle)
  }
  
  
  advanceIfMatch(needle: string): boolean {
    const isMatch = this.isMatch(needle)
    
    if (isMatch) {
      this.advance()
    }
    
    return isMatch
  }
  
  
  advance() {
    this.updateUnclosedBracketCount()
    this.index += 1
  }
  
  
  isDone(): boolean {
    if (this.index === this.text.length) {
      return false
    }
  }
  
  
  private isEscaped() {
    return '\\' === this.text[this.index]
  }
  

  private updateUnclosedBracketCount() {
    switch (this.text[this.index]) {
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