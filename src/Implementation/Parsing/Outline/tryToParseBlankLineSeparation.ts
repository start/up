import { BLANK_PATTERN } from '../../Patterns'
import { ThematicBreak } from '../../SyntaxNodes/ThematicBreak'
import { LineConsumer } from './LineConsumer'
import { OutlineParser } from './OutlineParser'

// Outline conventions (e.g. paragraphs, headings) are normally separated by 1 or 2 consecutive
// blank lines. The blank lines themselves don't produce any syntax nodes.
//
// However, 3 or more consecutive blank lines indicates extra, purposeful separation between
// outline conventions. We represent that separation with a `ThematicBreak` syntax node.
//
// NOTE: "Separation" is the magic word! Outer blank lines carry no semantic significance, and
// and they never produce thematic breaks.
export function tryToParseBlankLineSeparation(args: OutlineParser.Args): OutlineParser.Result {
  const markupLineConsumer = new LineConsumer(args.markupLines)

  while (true) {
    if (markupLineConsumer.done()) {
      // We've reached the end of our text! As mentioned above, outer blank lines never
      // produce thematic breaks.
      return {
        parsedNodes: [],
        countLinesConsumed: args.markupLines.length
      }
    }

    if (!markupLineConsumer.consumeLineIfMatches(BLANK_PATTERN)) {
      break
    }
  }

  const countBlankLines = markupLineConsumer.countLinesConsumed()

  if (!countBlankLines) {
    // If there are no blank lines, we can't say we parsed anything. Bail!
    return null
  }

  return {
    parsedNodes: (
      // This condition is easy. If we have fewer than 3 blank lines, we aren't dealing with a
      // thematic break.
      countBlankLines < 3
      // If we don't have a most recent sibling, that means we just parsed *leading* blank lines.
      // As mentioned above, outer blank lines never produce thematic breaks.
      || !args.mostRecentSibling
      // To produce a cleaner document, we condense multiple consecutive thematic breaks into one. 
      // (If the most recent sibling is a thematic break, we don't need another.)
      || args.mostRecentSibling instanceof ThematicBreak
    )
      ? []
      : [new ThematicBreak()],
    countLinesConsumed: countBlankLines
  }
}
