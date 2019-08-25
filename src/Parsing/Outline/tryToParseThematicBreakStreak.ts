import { DIVIDER_STREAK_PATTERN } from '../../Patterns'
import { ThematicBreak } from '../../SyntaxNodes/ThematicBreak'
import { LineConsumer } from './LineConsumer'
import { OutlineParserArgs } from './OutlineParserArgs'
import { OutlineParseResult } from './OutlineParseResult'


// A horizontal streak of characters indicates purposeful separation between outline conventions.
export function tryToParseThematicBreakStreak(args: OutlineParserArgs): OutlineParseResult {
  const markupLineConsumer = new LineConsumer(args.markupLines)

  if (!markupLineConsumer.consumeLineIfMatches(DIVIDER_STREAK_PATTERN)) {
    return null
  }

  return {
    parsedNodes: [new ThematicBreak()],
    countLinesConsumed: markupLineConsumer.countLinesConsumed
  }
}
