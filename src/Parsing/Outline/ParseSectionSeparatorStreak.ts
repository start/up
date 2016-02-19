import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { ParseArgs, OnParse } from '../Parser'
import { STREAK, either, BLANK } from './Patterns'

const STREAK_PATTERN = new RegExp(
  STREAK
)

// A line consisting solely of a streak of '-', '=', or '#' characters indicates separation between
// sections. The streak must not be immediately followed by a non-blank line, and it can be surrounded
// by any number of blank lines.
export function parseSectionSeparatorStreak(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)

  if (!consumer.consumeLineIf(STREAK_PATTERN)) {
    return false
  }

  onParse([new SectionSeparatorNode()], consumer.countCharsAdvanced(), parseArgs.parentNode)
  return true
}
