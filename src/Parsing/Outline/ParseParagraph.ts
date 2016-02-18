import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { ParseArgs, OnParse } from '../Parser'
import { parseInline } from '../Inline/ParseInline'
import { NON_BLANK } from './Patterns'

const NON_BLANK_PATTERN = new RegExp(
  NON_BLANK
)

// A paragraph is a non-blank line that doesn't satisfy any other outline convention.
export function parseParagraph(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)

  return consumer.consumeLineIf(NON_BLANK_PATTERN,
    (line) => {
      parseInline(line, { parentNode: new ParagraphNode(parseArgs.parentNode) },
        (inlineNodes, countCharsAdvanced, paragraphNode) => {
          paragraphNode.addChildren(inlineNodes)
          onParse([paragraphNode], consumer.countCharsAdvanced(), parseArgs.parentNode)
        })
    })
}
