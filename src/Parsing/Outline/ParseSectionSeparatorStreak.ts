import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { ParseArgs, OnParse } from '../Parser'
import { streakOf, dottedStreakOf, either, BLANK } from './Patterns'

const BLANK_PATTERN = new RegExp(
  BLANK
) 

const STREAK_PATTERN = new RegExp(
  either(
    streakOf('-'),
    streakOf('='),
    streakOf('#'),
    dottedStreakOf('-'),
    dottedStreakOf('='),
    dottedStreakOf('#')
  )
)

// A line consisting solely of a streak of '-', '=', or '#' characters indicates separation between
// sections. The streak must not be immediately followed by a non-blank line, and it can be surrounded
// by any number of blank lines.
export function parseSectionSeparatorStreak(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)

  // Happily consume any leading blank lines
  while (consumer.consumeLineIf(BLANK_PATTERN)) { }

  if (!consumer.consumeLineIf(STREAK_PATTERN)) {
    return false
  }

  // If there are any lines left...
  if (!consumer.done()) {
    // ...the next one needs to be blank
    if (!consumer.consumeLineIf(BLANK_PATTERN)) {
      return false
    }
    
    // Consume any remaining blank lines
    while (consumer.consumeLineIf(BLANK_PATTERN)) { }
  }

  onParse([new SectionSeparatorNode()], consumer.countCharsAdvanced(), parseArgs.parentNode)
  return true
}
