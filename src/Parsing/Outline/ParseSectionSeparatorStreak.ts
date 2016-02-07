import { ParseResult } from './../ParseResult'
import { FailedParseResult } from './../FailedParseResult'
import { parseInline } from '../Inline/ParseInline'

import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'

import { BLANK_LINE } from './Patterns'

export function parseSectionSeparatorWhitespace (text: string) {
  const consumer = new TextConsumer(text)

  const countBlankLinesInSeparator = 3
  
  let count = 0
  
  while (consumer.consumeLineIf(BLANK_LINE)) {
    count += 1
  }
  
  if (count < countBlankLinesInSeparator) {
    return new FailedParseResult()
  }
  
  return new ParseResult([new SectionSeparatorNode()], consumer.countCharsAdvanced())
}
