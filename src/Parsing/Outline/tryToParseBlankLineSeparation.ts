import { LineConsumer } from './LineConsumer'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { BLANK_PATTERN } from '../Patterns'
import { OutlineParserArgs } from './OutlineParserArgs'


// Outline conventions (e.g. paragraphs, headings) are normally separated by 1 or 2 consecutive blank lines.
// The blank lines themselves don't produce any syntax nodes.
//
// However, 3 or more consecutive blank lines indicates meaningful, deliberate separation between sections.
// We represent that separation with a SectionSeparatorNode.
export function tryToParseBlankLineSeparation(args: OutlineParserArgs): boolean {
  const lineConsumer = new LineConsumer(args.lines)
  let countBlankLines = 0

  while (lineConsumer.consume({ linePattern: BLANK_PATTERN })) {
    countBlankLines += 1
  }

  // If there are no blank lines, we can't say we parsed anything. Bail!  
  if (!countBlankLines) {
    return false
  }

  const COUNT_BLANK_LINES_IN_SECTION_SEPARATOR = 3

  const nodes =
    countBlankLines >= COUNT_BLANK_LINES_IN_SECTION_SEPARATOR
      ? [new SectionSeparatorNode()]
      : []

  args.then(nodes, lineConsumer.countLinesConsumed)
  return true
}
