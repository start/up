import { TextConsumer } from '../TextConsumer'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { ParseArgs, OnParse } from '../Parser'
import { STREAK, either, BLANK } from './Patterns'

const STREAK_PATTERN = new RegExp(
  STREAK
)

// A horizontal streak of characters indicates separation between sections.
export function parseSectionSeparatorStreak(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)

  if (!consumer.consumeLineIf(STREAK_PATTERN)) {
    return false
  }

  onParse([new SectionSeparatorNode()], consumer.countCharsConsumed(), parseArgs.parentNode)
  return true
}
