import { TextConsumer } from '../TextConsumer'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { parseInline } from '../Inline/ParseInline'
import { streakOf } from './Patterns'
import { ParseContext, OnParse } from '../Parser'

const CODE_FENCE_PATTERN = new RegExp(
  streakOf('`')
)

// Code blocks are surrounded (underlined and overlined) by streaks of backticks
export function parseCodeBlock(text: string, parseArgs: ParseContext, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)

  if (!consumer.consumeLineIfMatches({ pattern: CODE_FENCE_PATTERN })) {
    return false
  }

  const codeLines: string[] = []

  while (!consumer.done()) {
    
    if (consumer.consumeLineIfMatches({ pattern: CODE_FENCE_PATTERN })) {
      onParse(
        [new CodeBlockNode(codeLines.join('\n'))],
        consumer.countCharsConsumed(),
        parseArgs.parentNode)

      return true
    }

    consumer.consumeLine({
      then: (line) => codeLines.push(line)
    })
  }

  return false
}
