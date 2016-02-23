import { TextConsumer } from '../TextConsumer'
import { applyBackslashEscaping } from '../TextHelpers'
import { ParseContext, OnParse } from '../Parser'

import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'

export function parseCode(text: string, parseArgs: ParseContext, onParse: OnParse) {
  const consumer = new TextConsumer(text)

  return (
    consumer.consumeIfMatches('`')
    && consumer.consumeUpTo({
      needle: '`',
      then: (code) =>
        onParse(
          [new InlineCodeNode(applyBackslashEscaping(code))],
          consumer.lengthConsumed(),
          parseArgs.parentNode)
    }))
}