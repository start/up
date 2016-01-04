import { TextConsumer } from './TextConsumption/TextConsumer'

import { ParseResult } from './ParseResult'
import { FailedParseResult } from './FailedParseResult'

import { LinkNode } from '../SyntaxNodes/LinkNode'
import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'


export function parseLink(text: string, parentNode: LinkNode) {
  const textConsumer = new TextConsumer(text)

  while (!textConsumer.hasExaminedAllText()) {
    textConsumer.advance()
  }
  
  return new FailedParseResult()
}