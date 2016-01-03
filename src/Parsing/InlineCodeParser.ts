import { TextConsumer } from './TextConsumption/TextConsumer'

import { ParseResult } from './ParseResult'
import { FailedParseResult } from './FailedParseResult'

import { InlineCodeNode } from '../SyntaxNodes/InlineCodeNode'
import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'


export function parseInlineCode(text: string, parentNode: SyntaxNode) {
  const textConsumer = new TextConsumer(text)
  const END_DELIMETER = '`'
  
  while (!textConsumer.hasExaminedAllText()) {
    if (textConsumer.isMatch(END_DELIMETER)) {
      const inlineCodeNode = new InlineCodeNode([
          new PlainTextNode(textConsumer.consumeSkippedTextAndDiscard(END_DELIMETER))
        ]);
        
      return new ParseResult([inlineCodeNode], textConsumer.countCharsConsumed, parentNode)
    }
  }
  
  return new FailedParseResult()
}