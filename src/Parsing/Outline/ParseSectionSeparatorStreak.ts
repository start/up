import { OutlineTextConsumer } from './OutlineTextConsumer'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { STREAK, either, BLANK } from './Patterns'
import { OutlineParser, OutlineParserArgs, } from './OutlineParser'

const STREAK_PATTERN = new RegExp(
  STREAK
)

// A horizontal streak of characters indicates separation between sections.
export function parseSectionSeparatorStreak(args: OutlineParserArgs): boolean {
  const consumer = new OutlineTextConsumer(args.text)

  if (!consumer.consumeLine({ pattern: STREAK_PATTERN })) {
    return false
  }

  args.then([new SectionSeparatorNode()], consumer.lengthConsumed())
  return true
}
