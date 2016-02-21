import { RichSyntaxNode } from '../../SyntaxNodes/RichSyntaxNode'
import { TextConsumer, applyBackslashEscaping } from '../../TextConsumption/TextConsumer'
import { ParseArgs, OnParse } from '../Parser'

import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'

export function parseCode(text: string, parseArgs: ParseArgs, onParse: OnParse) {
  const consumer = new TextConsumer(text)
  
  return consumer.consumeIf('`')
    && consumer.consumeUpTo('`', (code) => {
      const escapedCode = applyBackslashEscaping(code)
      onParse([new InlineCodeNode(escapedCode)], consumer.countCharsConsumed(), parseArgs.parentNode)
    })
}