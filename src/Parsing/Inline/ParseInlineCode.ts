import { TextConsumer } from '../TextConsumer'
import { applyBackslashEscaping } from '../TextHelpers'
import { InlineParserArgs, InlineParser } from './InlineParser'

import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'

export function parseInlineCode(args: InlineParserArgs) {
  const consumer = new TextConsumer(args.text)

  return (
    // Parse the opening backtick
    consumer.consumeIfMatches('`')
    
    // Parse the content and the closing backtick
    && consumer.consumeUpTo({
      needle: '`',
      then: (codeContent) =>
        args.then(
          [new InlineCodeNode(applyBackslashEscaping(codeContent))],
          consumer.lengthConsumed())
    })
  )
}