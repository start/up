import { ParseResult } from './../ParseResult'
import { FailedParseResult } from './../FailedParseResult'
import { parseInline } from '../Inline/ParseInline'

import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'

export function parseSectionSeparatorWhitespace (text: string) {
  const consumer = new TextConsumer(text)
  
  const blankLine = /^\s*$/
  const countBlankLinesInSeparator = 3
  
  for (let i = 0; i < countBlankLinesInSeparator; i++) {
    if (!consumer.consumeLineIf(blankLine)) {
      return new FailedParseResult()
    }
  }
  
  return new ParseResult([new SectionSeparatorNode()], consumer.countCharsAdvanced())
}
