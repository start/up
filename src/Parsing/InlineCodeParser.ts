import { TextConsumer } from './TextConsumption/TextConsumer'

import { ParseResult } from './ParseResult'
import { FailedParseResult } from './FailedParseResult'

import { InlineCodeNode } from '../SyntaxNodes/InlineCodeNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'


export function parseInlineCode(text: string, parentNode: InlineCodeNode) {
  const textConsumer = new TextConsumer(text)
  const END_DELIMETER = '`'
  
  while (!textConsumer.hasExaminedAllText()) {
    if (textConsumer.isMatch(END_DELIMETER)) {
      const plainTextNode = 
          new PlainTextNode(textConsumer.consumeSkippedTextThenIgnoreNext(END_DELIMETER))

        
        textConsumer.ignoreAndConsume(END_DELIMETER.length)
        
      return new ParseResult([plainTextNode], textConsumer.countCharsConsumed, parentNode)
    }
    
    textConsumer.advance()
  }
  
  return new FailedParseResult()
}