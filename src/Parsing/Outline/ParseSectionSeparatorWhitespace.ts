import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { BLANK } from './Patterns'
import { ParseArgs, OnParse } from '../Parser'

const BLANK_PATTERN = new RegExp(
  BLANK
) 

// 3 or more consecutive blank lines indicates separation between sections.
export function parseSectionSeparatorWhitespace (text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)
  
  const countBlankLinesInSeparator = 3
  
  let count = 0
  
  while (consumer.consumeLineIf(BLANK_PATTERN)) {
    count += 1
  }
  
  if (count < countBlankLinesInSeparator) {
    return false
  }
  
  onParse([new SectionSeparatorNode()], consumer.countCharsAdvanced(), parseArgs.parentNode)
  return true
}
