import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { BLANK_LINE } from './Patterns'
import { OnParse } from '../Parser'

// 3 or more consecutive blank lines indicates separation between sections.
export function parseSectionSeparatorWhitespace (text: string, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)
  
  const countBlankLinesInSeparator = 3
  
  let count = 0
  
  while (consumer.consumeLineIf(BLANK_LINE)) {
    count += 1
  }
  
  if (count < countBlankLinesInSeparator) {
    return false
  }
  
  onParse([new SectionSeparatorNode()], consumer.countCharsAdvanced())
  return true
}
