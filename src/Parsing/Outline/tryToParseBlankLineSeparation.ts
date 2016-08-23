import { LineConsumer } from './LineConsumer'
import { ThematicBreak } from '../../SyntaxNodes/ThematicBreak'
import { BLANK_PATTERN } from '../Patterns'
import { OutlineParserArgs } from './OutlineParserArgs'


// Outline conventions (e.g. paragraphs, headings) are normally separated by 1 or 2 consecutive
// blank lines. The blank lines themselves don't produce any syntax nodes.
//
// However, 3 or more consecutive blank lines indicates extra, meaningful separation between
// outline conventions. We represent that separation with a ThematicBreak.
export function tryToParseBlankLineSeparation(args: OutlineParserArgs): boolean {
  const markupLineConsumer = new LineConsumer(args.markupLines)
  let countBlankLines = 0

  while (markupLineConsumer.consume({ linePattern: BLANK_PATTERN })) {
    countBlankLines += 1
  }

  // If there are no blank lines, we can't say we parsed anything. Bail!  
  if (!countBlankLines) {
    return false
  }

  const MIN_COUNT_BLANK_LINES_IN_OUTLINE_SEPARATOR = 3

  args.then(
    countBlankLines >= MIN_COUNT_BLANK_LINES_IN_OUTLINE_SEPARATOR
      ? [new ThematicBreak()]
      : [],
    markupLineConsumer.countLinesConsumed)

  return true
}
