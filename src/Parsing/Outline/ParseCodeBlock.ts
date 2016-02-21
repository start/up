import { TextConsumer } from '../TextConsumer'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { parseInline } from '../Inline/ParseInline'
import { streakOf } from './Patterns'
import { ParseArgs, OnParse } from '../Parser'

const FENCE_PATTERN = new RegExp(
  streakOf('`')
)

// Code blocks are surrounded (underlined and overlined) by streaks of backticks
export function parseCodeBlock(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)

  if (!consumer.consumeLineIfMatches(FENCE_PATTERN)) {
    return false
  }

  const codeLines: string[] = []

  while (!consumer.done()) {
    if (consumer.consumeLineIfMatches(FENCE_PATTERN)) {
      const codeBlockNode = new CodeBlockNode(codeLines.join('\n'))
      onParse([codeBlockNode], consumer.countCharsConsumed(), parseArgs.parentNode)
      return true
    }

    consumer.consumeLine({
      then: (line) => codeLines.push(line)
    })
  }

  return false
}
