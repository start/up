import { RichSyntaxNode } from '../../SyntaxNodes/RichSyntaxNode'
import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { ParseArgs, OnParse } from '../Parser'

import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'

export function parseCode(text: string, parseArgs: ParseArgs, onParse: OnParse) {
  const consumer = new TextConsumer(text)
  const delimiter = '`'

  if (!consumer.consumeIf(delimiter)) {
    return false
  }

  let content = ''

  while (!consumer.done()) {
    if (consumer.consumeIf(delimiter)) {
      if (onParse) {
        const node = new InlineCodeNode([new PlainTextNode(content)])
        onParse([node], consumer.countCharsAdvanced(), parseArgs.parentNode)
      }

      return true
    }

    content += consumer.currentChar()
    consumer.moveNext()
  }

  return false
}