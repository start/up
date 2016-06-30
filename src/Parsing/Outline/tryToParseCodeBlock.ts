import { LineConsumer } from './LineConsumer'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { streakOf } from '../PatternHelpers'
import { OUTPUT_LINE_BREAK } from '../Strings'
import { OutlineParserArgs } from './OutlineParserArgs'


// Code blocks are surrounded (underlined and overlined) by streaks of backticks.
//
// If the closing streak of backticks is missing, the code block extends to the end of the document.
export function tryToParseCodeBlock(args: OutlineParserArgs): boolean {
  const consumer = new LineConsumer(args.lines)

  if (!consumer.consume({ linePattern: CODE_FENCE_PATTERN })) {
    return false
  }

  const codeLines: string[] = []

  // Keep consuming lines until we get to the closing code fence.
  while (!consumer.done()) {
    if (consumer.consume({ linePattern: CODE_FENCE_PATTERN })) {
      break
    }

    consumer.consume({ then: line => codeLines.push(line) })
  }

  const codeBlock = new CodeBlockNode(codeLines.join(OUTPUT_LINE_BREAK))
  args.then([codeBlock], consumer.countLinesConsumed)

  return true
}


const CODE_FENCE_PATTERN =
  new RegExp(streakOf('`'))
