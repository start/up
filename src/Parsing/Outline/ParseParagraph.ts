import { TextConsumer } from '../TextConsumer'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { getInlineNodes } from '../Inline/GetInlineNodes'
import { NON_BLANK } from './Patterns'
import { OutlineParser, OutlineParserArgs, } from './OutlineParser'

const NON_BLANK_PATTERN = new RegExp(
  NON_BLANK
)

// A paragraph is a non-blank line that doesn't satisfy any other outline convention.
export function parseParagraph(args: OutlineParserArgs): boolean {
  const consumer = new TextConsumer(args.text)

  return consumer.consumeLine({
    pattern: NON_BLANK_PATTERN,
    then: (line) =>
      args.then([new ParagraphNode(getInlineNodes(line))], consumer.lengthConsumed())
  })
}
