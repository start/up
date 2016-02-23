import { TextConsumer } from '../TextConsumer'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { parseInline } from '../Inline/ParseInline'
import { NON_BLANK, STREAK } from './Patterns'
import { ParseContext, OnParse } from '../Parser'

const NON_BLANK_LINE_PATTERN = new RegExp(
  NON_BLANK
)

const STREAK_PATTERN = new RegExp(
  STREAK
)

// 2 or more consecutive non-blank lines are treated as... lines. Not paragraphs!
export function parseLineBlock(text: string, parseArgs: ParseContext, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)
  const nonBlankLines: string[] = []
  
  // Collect all consecutive non-blank lines
  while (consumer.consumeLine({
    if: (line) => NON_BLANK_LINE_PATTERN.test(line) && !STREAK_PATTERN.test(line),
    then: (line) => nonBlankLines.push(line)
  })) { }

  if (nonBlankLines.length < 2) {
    return false
  }

  let lineBlockNode = new LineBlockNode(parseArgs.parentNode)

  for (let line of nonBlankLines) {
    parseInline(line, { parentNode: new LineNode(lineBlockNode) },
      (inlineNodes, countCharsAdvanced, lineNode) => {
        lineNode.addChildren(inlineNodes)
        lineBlockNode.addChild(lineNode)
      })
  }

  onParse([lineBlockNode], consumer.lengthConsumed(), parseArgs.parentNode)
  return true
}
