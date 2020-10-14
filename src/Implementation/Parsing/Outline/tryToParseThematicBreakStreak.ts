import { DIVIDER_STREAK_PATTERN } from '../../Patterns'
import { ThematicBreak } from '../../SyntaxNodes/ThematicBreak'
import { LineConsumer } from './LineConsumer'
import { OutlineParser } from './OutlineParser'


// A horizontal streak of characters indicates purposeful separation between outline conventions.
export function tryToParseThematicBreakStreak(args: OutlineParser.Args): OutlineParser.Result {
  const markupLineConsumer = new LineConsumer(args.markupLines)

  if (!markupLineConsumer.consumeLineIfMatches(DIVIDER_STREAK_PATTERN)) {
    return null
  }

  return {
    parsedNodes: (
      // To produce a cleaner document, we condense multiple consecutive thematic breaks into one. 
      // (If the most recent sibling is a thematic break, we don't need another.)
      args.mostRecentSibling instanceof ThematicBreak
        ? []
        : [new ThematicBreak()]),
    countLinesConsumed: markupLineConsumer.countLinesConsumed()
  }
}
