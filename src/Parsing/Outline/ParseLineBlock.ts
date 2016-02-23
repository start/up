import { TextConsumer } from '../TextConsumer'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { getInlineNodes } from '../Inline/GetInlineNodes'
import { NON_BLANK, STREAK } from './Patterns'
import { OutlineParser, OutlineParserArgs, } from './OutlineParser'

const NON_BLANK_LINE_PATTERN = new RegExp(
  NON_BLANK
)

const STREAK_PATTERN = new RegExp(
  STREAK
)

// 2 or more consecutive non-blank lines are treated as... lines. Not paragraphs!
export function parseLineBlock(args: OutlineParserArgs): boolean {
  const consumer = new TextConsumer(args.text)
  const nonBlankLines: string[] = []
  
  // Collect all consecutive non-blank lines
  while (consumer.consumeLine({
    if: (line) => NON_BLANK_LINE_PATTERN.test(line) && !STREAK_PATTERN.test(line),
    then: (line) => nonBlankLines.push(line)
  })) { }

  if (nonBlankLines.length < 2) {
    return false
  }

  let lineBlockNode = new LineBlockNode(
    nonBlankLines.map((line) => new LineNode(getInlineNodes(line)))
  )

  args.then([lineBlockNode], consumer.lengthConsumed())
  return true
}
