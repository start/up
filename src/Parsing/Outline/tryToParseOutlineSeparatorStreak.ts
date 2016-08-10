import { LineConsumer } from './LineConsumer'
import { OutlineSeparatorNode } from '../../SyntaxNodes/OutlineSeparatorNode'
import { DIVIDER_STREAK_PATTERN } from '../Patterns'
import { OutlineParserArgs } from './OutlineParserArgs'


// A horizontal streak of characters indicates meaningful separation between outline conventions.
export function tryToParseOutlineSeparatorStreak(args: OutlineParserArgs): boolean {
  const markupLineConsumer = new LineConsumer(args.markupLines)

  if (!markupLineConsumer.consume({ linePattern: DIVIDER_STREAK_PATTERN })) {
    return false
  }

  args.then(
    [new OutlineSeparatorNode()],
    markupLineConsumer.countLinesConsumed)

  return true
}
