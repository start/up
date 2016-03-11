import { TextConsumer } from '../TextConsumer'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { Line } from '../../SyntaxNodes/Line'
import { getInlineNodes } from '../Inline/GetInlineNodes'
import { NON_BLANK, STREAK } from './Patterns'
import { isLineFancyOutlineConvention } from './IsLineFancyOutlineConvention'
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
  
  // Even if there are multiple consecutive non-blank lines, they shouldn't necessariliy all be
  // included in the line block.
  //
  // For example:
  //
  // Roses are red
  // Violets are blue
  // =*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*
  // Anyway, poetry is pretty fun.
  //
  // Only the first 2 lines should be included.
  const lines: Line[] = []
  
  while (consumer.consumeLine({
    pattern: NON_BLANK_LINE_PATTERN,
    if: (line) => !isLineFancyOutlineConvention(line),
    then: (line) => lines.push(new Line(getInlineNodes(line)))
  })) { }

  if (lines.length < 2) {
    return false
  }

  args.then([new LineBlockNode(lines)], consumer.lengthConsumed())
  return true
}
