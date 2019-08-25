import { streakOf } from '../../PatternHelpers'
import { CodeBlock } from '../../SyntaxNodes/CodeBlock'
import { LineConsumer } from './LineConsumer'
import { OutlineParserArgs } from './OutlineParserArgs'


// Code blocks are surrounded (underlined and overlined) by matching streaks of backticks.
//
// If no matching end streak is found, the code block extends to the end of the document (or to
// the end of the current outline convention, if the code block is nested within one).
//
// Code blocks can contain streaks of backticks that aren't exactly as long as the enclosing streaks.
export function tryToParseCodeBlock(args: OutlineParserArgs): boolean {
  const markupLineConsumer = new LineConsumer(args.markupLines)

  const startStreakResult =
    markupLineConsumer.consumeLineIfMatches(CODE_BLOCK_STREAK_PATTERN)

  if (!startStreakResult) {
    return false
  }

  const startStreak = startStreakResult.line.trim()
  const codeLines: string[] = []

  // Let's keep consuming lines until we find a streak that matches the first one.
  while (!markupLineConsumer.done) {
    const endStreakResult =
      markupLineConsumer.consumeLineIfMatches(CODE_BLOCK_STREAK_PATTERN)

    if (endStreakResult) {
      const endStreak = endStreakResult.line.trim()

      // Alright, we have a possible end streak!
      if (endStreak.length === startStreak.length) {
        // It matches the start streak! Let's bail.
        break
      }

      // The streak didn't match the start streak, so let's include it in the code block.
      codeLines.push(endStreak)
      continue
    }

      // Since we don't have a possible end streak, we'll just treat this line as code and move
      // on to the next one.
    codeLines.push(markupLineConsumer.consumeLine())
  }

  args.then(
    [new CodeBlock(codeLines.join(RENDERED_LINE_BREAK))],
    markupLineConsumer.countLinesConsumed)

  return true
}


const CODE_BLOCK_STREAK_PATTERN =
  streakOf('`')

// Eventually, this should be configurable.
const RENDERED_LINE_BREAK = '\n'
