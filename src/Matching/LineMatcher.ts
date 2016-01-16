import { TextMatchResult } from './TextMatchResult'
import { FailedTextMatchResult } from './FailedTextMatchResult'
import { TextMatcher, onTextMatch } from './TextMatcher'

export class LineMatcher extends TextMatcher {
  
  line(onSuccess: onTextMatch): void {
    this.matchLine(/.?/, onSuccess)
  }

  matchLine(pattern: RegExp, onSuccess?: onTextMatch): boolean {
    const clonedMatcher = new TextMatcher(this.text, this.text.substring(0, this.index))
    
    let endOfLineIndex = 0
    let line = ''
    
    while (!clonedMatcher.done()) {
      endOfLineIndex += 1
      
      if(clonedMatcher.match('\n')) {
        break;
      }
      
      // We don't want the line's text to include the final line break, so we only add
      // characters once we know they're not line breaks. 
      line += clonedMatcher.currentChar()
      clonedMatcher.advance()
    }
    
    // TODO: Use this
    let isRejected = true
    const reject =  () => { isRejected = false }
    
    if (pattern.test(line)) {
      onSuccess(new TextMatchResult(endOfLineIndex, line), reject)
      return true
    }
    
    return false
  }


  // TODO: Make this take a callback
  lineIgnoringEscaping(): TextMatchResult {
    const indexOfEol = this.text.indexOf('\n', this.index)

    const newIndex = (
      indexOfEol === -1
        ? this.text.length
        : indexOfEol + 1
    )

    return new TextMatchResult(newIndex, this.text.substring(this.index, newIndex))
  }
}