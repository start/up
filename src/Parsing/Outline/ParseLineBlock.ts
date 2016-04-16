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
//
// Roses are red
// Violets are blue
// Lyrics have line
// And address do, too

export function parseLineBlock(args: OutlineParserArgs): boolean {
  const consumer = new TextConsumer(args.text)
  
  // Even if there are multiple consecutive non-blank lines, they shouldn't necessariliy all be
  // included in the line block.
  //
  // For example:
  //
  // Roses are red
  // Violets are blue
  // =*=*=*=*=*=*=*=*=*=*=*=
  // Anyway, poetry is pretty fun.
  //
  // Only the first 2 lines are included in the line block.
  //
  // Line blocks are interrupted by a line if it wouldn't be parsed as a regular paragraph. That's
  // why the section separator streak ended it.
  //
  // However, line blocks are *not* interupted by a line if it is merely the beginning of another
  // outline convention. This distinction is actually demonstrated in the example above!
  //
  // "Violets are blue" would be interepreted as a heading due to the following line. But because
  // line blocks only examine each line individually, the line is accepted.
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
