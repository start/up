import { LineConsumer } from './LineConsumer'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { streakOf } from '../Patterns'
import { OutlineParser } from './OutlineParser'
import { OutlineParserArgs } from './OutlineParserArgs'


// Code blocks are surrounded (underlined and overlined) by streaks of backticks
export function parseCodeBlock(args: OutlineParserArgs): boolean {
  const consumer = new LineConsumer(args.text)

  if (!consumer.consumeLine({ pattern: CODE_FENCE_PATTERN })) {
    return false
  }

  const codeLines: string[] = []

  // Keep consuming lines until we get to the closing code fence
  while (!consumer.done()) {
    if (consumer.consumeLine({ pattern: CODE_FENCE_PATTERN })) {
      args.then([new CodeBlockNode(codeLines.join('\n'))], consumer.countCharsConsumed())
      return true
    }

    consumer.consumeLine({
      then: line => codeLines.push(line)
    })
  }

  return false
}


const CODE_FENCE_PATTERN = new RegExp(
  streakOf('`'))
