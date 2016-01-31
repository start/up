interface onMatchBeforeConsumption {
  (remaining?: string, skip?: skipCountChars, reject?: rejectMatch): void
}

interface beforeLineConsumption {
  (line: string, remaining?: string, skip?: skipCountChars, reject?: rejectMatch): void
}

interface rejectMatch {
  (): void
}

interface skipCountChars {
  (count: number): void
}

export class TextConsumer {

  public text: string;
  public index = 0;
  private isCurrentCharEscaped = false;
  private countUnclosedParen = 0;
  private countUnclosedSquareBracket = 0;

  constructor(text: string) {
    this.text = text

    this.handleEscaping()
  }


  done(): boolean {
    return this.index >= this.text.length
  }


  consume(needle: string, onMatchBeforeConsumption?: onMatchBeforeConsumption): boolean {
    const isMatch =
      !this.isCurrentCharEscaped && (needle === this.text.substr(this.index, needle.length)) && this.areRelevantBracketsClosed(needle)

    if (isMatch) {
      let isRejected = false
      let charsToSkip = needle.length
      
      if (onMatchBeforeConsumption) {
        const skip = (count: number) => { charsToSkip += count }
        const reject = () => { isRejected = true }
        onMatchBeforeConsumption(this.remaining().substr(charsToSkip), skip, reject)
      }
      
      if (isRejected) {
        return false
      }
      
      this.skip(charsToSkip)
      return true
    }

    return false
  }
  
  
  consumeLine(beforeLineConsumption: beforeLineConsumption): boolean {
    const clone = this.clone()
    
    let lineContentLength = 0
    
    while (!clone.done() && !clone.consume('\n')) {
      clone.moveNext()      
      lineContentLength += 1 
    }
  
    let isRejected = false
    let charsToSkip = lineContentLength + 1
    
    if (beforeLineConsumption) {        
      const line = this.remaining().substr(0, lineContentLength)
      const remaining = this.remaining().substr(line.length)
      
      const skip = (count: number) => { charsToSkip += count }
      const reject = () => { isRejected = true }
      
      beforeLineConsumption(line, remaining, skip, reject)
    }
    
    if (isRejected) {
      return false
    }
    
    this.skip(charsToSkip)
    return true
  }


  moveNext(): void {
    // Only non-escaped brackets that weren't part of a match should affect the opened/closed counts we're keeping.
    if (!this.isCurrentCharEscaped) {
      this.updateUnclosedBracketCounts()
    }

    this.index += 1
    this.handleEscaping()
  }


  skip(count: number): void {
    this.index += count
    this.handleEscaping()
  }


  countCharsAdvanced(): number {
    return this.index
  }


  remaining(): string {
    return this.text.slice(this.index)
  }


  currentChar(): string {
    return this.text[this.index]
  }


  private handleEscaping() {
    this.isCurrentCharEscaped = false

    if (this.currentChar() === '\\') {
      this.index += 1
      this.isCurrentCharEscaped = true
    }
  }


  private updateUnclosedBracketCounts(): void {
    switch (this.currentChar()) {
      case '(':
        this.countUnclosedParen += 1
        break
      case ')':
        this.countUnclosedParen = Math.max(0, this.countUnclosedParen - 1)
        break
      case '[':
        this.countUnclosedSquareBracket += 1
        break
      case ']':
        this.countUnclosedSquareBracket = Math.max(0, this.countUnclosedSquareBracket - 1)
        break
    }
  }


  private areRelevantBracketsClosed(needle: string): boolean {
    // We only care about unclosed brackets if `needle` would appear to close them. If that's the case
    // we refuse to match `needle`, because the author likely intended it to be plain text.
    return (
      (!this.countUnclosedSquareBracket || !appearsToCloseAnyPreceedingBrackets(needle, '[', ']'))
      && (!this.countUnclosedParen || !appearsToCloseAnyPreceedingBrackets(needle, '(', ')'))
    )
  }
  
  
  private clone(): TextConsumer {
    const clone = new TextConsumer('')
    
    clone.text = this.text
    clone.index = this.index
    clone.isCurrentCharEscaped = this.isCurrentCharEscaped
    clone.countUnclosedParen = this.countUnclosedParen
    clone.countUnclosedSquareBracket = this.countUnclosedSquareBracket
    
    return clone
  }
}

// Returns true if `text` contains any closing brackets that would appear to close any preceeding opening brackets.
//
// Assuming '(' and ')' are the specified brackets, the following examples would cause this function to return `true`:
//
//   )
//   ))
//   hello)
//   ( ))
//   ) ((((
//
// And the following examples would not:
//
//   ()
//   (( )
function appearsToCloseAnyPreceedingBrackets(text: string, openingBracketChar: string, closingBracketChar: string) {
  let countSurplusOpened = 0

  for (let char of text) {

    switch (char) {
      case openingBracketChar:
        countSurplusOpened += 1
        break

      case closingBracketChar:
        if (!countSurplusOpened) {
          return true
        }
        countSurplusOpened -= 1
        break
    }
  }

  return false
}
