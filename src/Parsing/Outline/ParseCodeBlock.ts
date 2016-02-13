import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { parseInline } from '../Inline/ParseInline'
import { streakOf } from './Patterns'
import { ParseArgs, OnParse } from '../Parser'

const FENCE = new RegExp(streakOf('`'))

// Code blocks are surrounded (underlined and overlined) by streaks of backticks
export function parseLineBlock(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)

  if (!consumer.consumeLineIf(FENCE)) {
    return false
  }

  const codeLines: string[] = []

  while (!consumer.done()) {
    if (consumer.consumeLineIf(FENCE)) {
      const codeBlockNode = new CodeBlockNode([new PlainTextNode(codeLines.join('\n'))])
      onParse([codeBlockNode], consumer.countCharsAdvanced(), parseArgs.parentNode)
      return true
    }

    consumer.consumeLine((line) => {
      codeLines.push(line)
    })
  }

  return false
}
