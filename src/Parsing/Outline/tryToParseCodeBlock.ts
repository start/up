import { LineConsumer } from './LineConsumer'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { streakOf } from '../PatternHelpers'
import { OUTPUT_LINE_BREAK } from '../Strings'
import { OutlineParserArgs } from './OutlineParserArgs'


// Code blocks are surrounded (underlined and overlined) by matching streaks of backticks.
//
// If no matching end streak is found, the code block extends to the end of the document.
export function tryToParseCodeBlock(args: OutlineParserArgs): boolean {
  const consumer = new LineConsumer(args.lines)

  let startStreak: string

  consumer.consume({
    linePattern: CODE_FENCE_PATTERN,
    then: match => { startStreak = match }
  })

  if (!startStreak) {
    return false
  }

  const codeLines: string[] = []

  // Let's keep consuming lines until we find a streak that matches the first one.
  while (!consumer.done()) {
    let possibleEndStreak: string

    consumer.consume({
      linePattern: CODE_FENCE_PATTERN,
      then: match => { possibleEndStreak = match }
    })

    // Did we just find a possible end streak?
    if (possibleEndStreak) {
      if (possibleEndStreak.length === startStreak.length) {
        // It matches the start streak! Let's bail
        break
      }

      // Well, it doesn't match. Let's include this fence as part of the code block.
      codeLines.push(possibleEndStreak)
    }

    consumer.consume({ then: line => codeLines.push(line) })
  }

  const codeBlock = new CodeBlockNode(codeLines.join(OUTPUT_LINE_BREAK))
  args.then([codeBlock], consumer.countLinesConsumed)

  return true
}


const CODE_FENCE_PATTERN =
  new RegExp(streakOf('`'))
