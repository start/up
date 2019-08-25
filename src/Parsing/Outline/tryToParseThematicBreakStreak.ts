import { DIVIDER_STREAK_PATTERN } from '../../Patterns'
import { ThematicBreak } from '../../SyntaxNodes/ThematicBreak'
import { LineConsumer } from './LineConsumer'
import { OutlineParserArgs } from './OutlineParserArgs'


// A horizontal streak of characters indicates purposeful separation between outline conventions.
export function tryToParseThematicBreakStreak(args: OutlineParserArgs): boolean {
  const markupLineConsumer = new LineConsumer(args.markupLines)

  if (!markupLineConsumer.consumeLineIfMatches(DIVIDER_STREAK_PATTERN)) {
    return false
  }

  args.then(
    [new ThematicBreak()],
    markupLineConsumer.countLinesConsumed)

  return true
}
