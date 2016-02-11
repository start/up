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
  
  return consumer.consumeUpTo(delimiter, (code, totalCountCharsAdvanced) => {
    const node = new InlineCodeNode([new PlainTextNode(code)])
    onParse([node], totalCountCharsAdvanced, parseArgs.parentNode)
  })
}