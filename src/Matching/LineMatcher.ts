import { TextMatchResult } from './TextMatchResult'
import { FailedTextMatchResult } from './FailedTextMatchResult'
import { TextMatcher, onTextMatch } from './TextMatcher'

export class LineMatcher extends TextMatcher {
  
  line(onSuccess: onTextMatch): void {
    this.matchLine(/.?/, onSuccess)
  }

  matchLine(pattern: RegExp, onSuccess: onTextMatch): boolean {
    const clonedMatcher = new TextMatcher(this.text, this.text.substring(0, this.index))
    
    let endOfLineIndex = 0
    let line = ''
    
    while (!clonedMatcher.done()) {
      endOfLineIndex += 1
      
      if(clonedMatcher.match('\n')) {
        break;
      }
      
      // We don't want to include the final line break when returning the line's text,
      // so we only add a character once we know it's 
      line += clonedMatcher.currentChar()
      clonedMatcher.advance()
    }
    
    
    let isRejected = true
    const reject =  () => { isRejected = false }
    
    onSuccess(new TextMatchResult(endOfLineIndex, line), reject)
    
    return !isRejected
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