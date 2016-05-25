import { LineConsumer } from './LineConsumer'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { STREAK } from '../Patterns'
import { OutlineParser } from './OutlineParser'
import { OutlineParserArgs } from './OutlineParserArgs'


// A horizontal streak of characters indicates separation between sections.
export function parseSectionSeparatorStreak(args: OutlineParserArgs): boolean {
  const consumer = new LineConsumer(args.text)

  if (!consumer.consumeLine({ pattern: STREAK_PATTERN })) {
    return false
  }

  args.then([new SectionSeparatorNode()], consumer.countCharsConsumed())
  return true
}


const STREAK_PATTERN = new RegExp(
  STREAK)
