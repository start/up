import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { ParseArgs, OnParse } from '../Parser'
import { streakOf, dottedStreakOf, either, BLANK_LINE } from './Patterns'

const STREAK = new RegExp(
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

  while (consumer.consumeLineIf(BLANK_LINE)) { }

  if (!consumer.consumeLineIf(STREAK)) {
    return false
  }

  // If there are any lines left...
  if (!consumer.done()) {
    // ...the next one needs to be blank
    if (!consumer.consumeLineIf(BLANK_LINE)) {
      return false
    }
    
    while (consumer.consumeLineIf(BLANK_LINE)) { }
  }
  

  onParse([new SectionSeparatorNode()], consumer.countCharsAdvanced(), parseArgs.parentNode)
  return true
}
