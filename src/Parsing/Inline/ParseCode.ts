import { RichSyntaxNode } from '../../SyntaxNodes/RichSyntaxNode'
import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { OnParse } from '../Parser'

import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'

export function parseCode(text: string, parentNode: RichSyntaxNode, onParse: OnParse) {
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
        onParse([node], consumer.countCharsAdvanced())
      }

      return true
    }

    content += consumer.currentChar()
    consumer.moveNext()
  }

  return false
}