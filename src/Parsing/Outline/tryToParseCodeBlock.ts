import { LineConsumer } from './LineConsumer'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { streakOf } from '../PatternHelpers'
import { OUTPUT_LINE_BREAK } from '../Strings'
import { OutlineParserArgs } from './OutlineParserArgs'


// Code blocks are surrounded (underlined and overlined) by streaks of backticks
export function tryToParseCodeBlock(args: OutlineParserArgs): boolean {
  const consumer = new LineConsumer(args.text)

  if (!consumer.consume({ linePattern: CODE_FENCE_PATTERN })) {
    return false
  }

  const codeLines: string[] = []

  // Keep consuming lines until we get to the closing code fence
  while (!consumer.reachedEndOfText()) {
    if (consumer.consume({ linePattern: CODE_FENCE_PATTERN })) {
      const codeBlock = new CodeBlockNode(codeLines.join(OUTPUT_LINE_BREAK))
      args.then([codeBlock], consumer.textIndex)
      return true
    }

    consumer.consume({
      then: line => codeLines.push(line)
    })
  }

  return false
}


const CODE_FENCE_PATTERN =
  new RegExp(streakOf('`'))
