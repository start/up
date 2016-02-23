import { TextConsumer } from '../TextConsumer'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { ParseContext, OnParse } from '../Parser'
import { parseInline } from '../Inline/ParseInline'
import { NON_BLANK } from './Patterns'

const NON_BLANK_PATTERN = new RegExp(
  NON_BLANK
)

// A paragraph is a non-blank line that doesn't satisfy any other outline convention.
export function parseParagraph(text: string, parseArgs: ParseContext, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)

  return consumer.consumeLineIfMatches({
    pattern: NON_BLANK_PATTERN,
    then: (line) =>
      parseInline(line, { parentNode: new ParagraphNode(parseArgs.parentNode) },
        (inlineNodes, countCharsAdvanced, paragraphNode) => {
          paragraphNode.addChildren(inlineNodes)
          onParse([paragraphNode], consumer.countCharsConsumed(), parseArgs.parentNode)
        })
  })
}
