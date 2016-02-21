import { TextConsumer } from '../TextConsumer'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { parseInline } from '../Inline/ParseInline'
import { NON_BLANK } from './Patterns'
import { ParseArgs, OnParse } from '../Parser'

const NON_BLANK_LINE_PATTERN = new RegExp(
  NON_BLANK
) 

// 2 or more consecutive non-blank lines are treated as... lines. Not paragraphs!
export function parseLineBlock(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)

  const nonBlankLines: string[] = []

  // Collect all consecutive non-blank lines
  while (consumer.consumeLineIfMatches(NON_BLANK_LINE_PATTERN, (line) => { nonBlankLines.push(line) })) { }

  if (nonBlankLines.length <= 1) {
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

  onParse([lineBlockNode], consumer.countCharsConsumed(), parseArgs.parentNode)
  return true
}
