import { LineConsumer } from './LineConsumer'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { DIVIDER_STREAK_PATTERN } from '../Patterns'
import { OutlineParserArgs } from './OutlineParserArgs'


// A horizontal streak of characters indicates separation between sections.
export function tryToParseSectionSeparatorStreak(args: OutlineParserArgs): boolean {
  const markupLineConsumer = new LineConsumer(args.markupLines)

  if (!markupLineConsumer.consume({ linePattern: DIVIDER_STREAK_PATTERN })) {
    return false
  }

  args.then([new SectionSeparatorNode()], markupLineConsumer.countLinesConsumed)
  return true
}
