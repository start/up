import { LineConsumer } from './LineConsumer'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { DIVIDER_STREAK_PATTERN } from '../../Patterns'
import { OutlineParser } from './OutlineParser'
import { OutlineParserArgs } from './OutlineParserArgs'


// A horizontal streak of characters indicates separation between sections.
export function parseSectionSeparatorStreak(args: OutlineParserArgs): boolean {
  const consumer = new LineConsumer(args.text)

  if (!consumer.consume({ linePattern: DIVIDER_STREAK_PATTERN })) {
    return false
  }

  args.then([new SectionSeparatorNode()], consumer.textIndex)
  return true
}

