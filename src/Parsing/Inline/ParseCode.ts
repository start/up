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
      const inlineCodeNode = new InlineCodeNode([new PlainTextNode(escapedCode)])
      onParse([inlineCodeNode], consumer.countCharsAdvanced(), parseArgs.parentNode)
    })
}