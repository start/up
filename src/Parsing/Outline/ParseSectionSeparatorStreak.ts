import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { ParseArgs, OnParse } from '../Parser'
import { streakOf, dottedStreakOf, either, BLANK_LINE } from './Patterns'

const STREAK = new RegExp(
  either(
    streakOf('-'),
    streakOf('='),
    streakOf('#')
  )
)

// A line consisting solely of a streak of characters, surrounded by any number of blank lines,
// indicates separation between section. 
export function parseSectionSeparatorStreak(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)

  while (consumer.consumeLineIf(BLANK_LINE)) { }

  if (!consumer.consumeLineIf(STREAK)) {
    return false
  }

  while (consumer.consumeLineIf(BLANK_LINE)) { }

  onParse([new SectionSeparatorNode()], consumer.countCharsAdvanced(), parseArgs.parentNode)
  return true
}
