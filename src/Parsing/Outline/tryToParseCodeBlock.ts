import { LineConsumer } from './LineConsumer'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { streakOf } from '../PatternHelpers'
import { OUTPUT_LINE_BREAK } from '../Strings'
import { OutlineParserArgs } from './OutlineParserArgs'


// Code blocks are surrounded (underlined and overlined) by matching streaks of backticks.
//
// If no matching end streak is found, the code block extends to the end of the document (or to
// the end of the current outline convention, if the code block is nested within one).
export function tryToParseCodeBlock(args: OutlineParserArgs): boolean {
  const markupLineConsumer = new LineConsumer(args.markupLines)

  let startStreak: string

  markupLineConsumer.consume({
    linePattern: CODE_BLOCK_STREAK_PATTERN,
    then: match => {
      startStreak = match
    }
  })

  if (!startStreak) {
    return false
  }

  const codeLines: string[] = []

  // Let's keep consuming lines until we find a streak that matches the first one.
  while (!markupLineConsumer.done()) {
    let possibleEndStreak: string

    markupLineConsumer.consume({
      linePattern: CODE_BLOCK_STREAK_PATTERN,
      then: match => {
        possibleEndStreak = match
      }
    })

    if (!possibleEndStreak) {
      // If we don't have a possible end streak, we'll just treat this line as code and move
      // on to the next one.
      markupLineConsumer.consume({
        then: line => {
          codeLines.push(line)
        }
      })

      continue
    }

    // Alright, we have a possible end streak!

    if (possibleEndStreak.length === startStreak.length) {
      // It matches the start streak! Let's bail.
      break
    }

    // The streak didn't match the start streak, so let's include it in the code block.
    codeLines.push(possibleEndStreak)
  }

  args.then(
    [new CodeBlockNode(codeLines.join(OUTPUT_LINE_BREAK))],
    markupLineConsumer.countLinesConsumed)

  return true
}


const CODE_BLOCK_STREAK_PATTERN =
  streakOf('`')
