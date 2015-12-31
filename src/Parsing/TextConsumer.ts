export class TextConsumer {
  private index = 0;
  
  
  constructor(private text: string) { }
  
  
  isMatch(needle: string) {
    if (this.isEscaped()) {
      return false
    }
    
    return (needle === this.text.substr(this.index, needle.length))
  }
  
  
  advance() {
    this.index += 1
  }
  
  
  private isEscaped() {
    return '\\' === this.text[this.index]
  }
}
