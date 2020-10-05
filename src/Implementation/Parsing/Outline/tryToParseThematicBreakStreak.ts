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
    parsedNodes: [new ThematicBreak()],
    countLinesConsumed: markupLineConsumer.countLinesConsumed()
  }
}
