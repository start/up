import { RichSyntaxNode } from '../../SyntaxNodes/RichSyntaxNode'
import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { ParseArgs, OnParse } from '../Parser'

import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'

export function parseCode(text: string, parseArgs: ParseArgs, onParse: OnParse) {
  const consumer = new TextConsumer(text)
  
  return consumer.consumeIf('`')
    && consumer.consumeUpTo('`', (escapedCode) => {
      const node = new InlineCodeNode([new PlainTextNode(escapedCode)])
      onParse([node], consumer.countCharsAdvanced(), parseArgs.parentNode)
    })
}