import { TextMatchResult } from './TextMatchResult'
import { FailedTextMatchResult } from './FailedTextMatchResult'
import { TextMatcher } from './TextMatcher'

export class LineMatcher extends TextMatcher {

  line(): TextMatchResult {
    const clonedMatcher = new TextMatcher(this.text, this.text.substring(0, this.index))
    
    while (!clonedMatcher.done()) {
      const eolMatch = clonedMatcher.match('\n')
      
      if (eolMatch.success()) {
        // Don't include the final line break in the result's text...
        const line = this.text.slice(this.index, eolMatch.newIndex - 1)
        
        // ...But do advance past the line break in the new index
        return new TextMatchResult(eolMatch.newIndex, line)
      }
      
      clonedMatcher.advance()
    }
    
    return new TextMatchResult(this.text.length, this.remaining())
  }


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