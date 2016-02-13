import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { parseInline } from '../Inline/ParseInline'
import { NON_BLANK_LINE } from './Patterns'
import { ParseArgs, OnParse } from '../Parser'

// 2 or more consecutive non-blank lines are treated as... lines. Not paragraphs!
export function parseLineBlock(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)

  const nonBlankLines: string[] = []

  // Collect all consecutive non-blank lines
  while (consumer.consumeLineIf(NON_BLANK_LINE, (line) => { nonBlankLines.push(line) })) { }

  if (nonBlankLines.length <= 1) {
    return false
  }

  let lineBlockNode = new LineBlockNode(parseArgs.parentNode)

  const lineNodes = nonBlankLines.map((line) => {
    let lineNode = new LineNode(lineBlockNode)

    parseInline(line, { parentNode: parseArgs.parentNode }, (inlineNodes) => {
      lineNode.addChildren(inlineNodes)
    })

    return lineNode
  })

  lineBlockNode.addChildren(lineNodes)

  onParse([lineBlockNode], consumer.countCharsAdvanced(), parseArgs.parentNode)
  return true
}
