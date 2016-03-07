import { TextConsumer } from '../TextConsumer'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
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
  
  // Not all consecutive non-blank lines should be included in a line block.
  //
  // For example:
  //
  // Roses are red
  // Violets are blue
  // =*=*=*=*=*=*=*=*
  // Anyway, poetry is pretty fun.
  //
  // The first two lines should be parsed as a line block, but the second two lines should not
  // be included.
  const lineNodes: LineNode[] = []
  
  while (consumer.consumeLine({
    pattern: NON_BLANK_LINE_PATTERN,
    if: (line) => !isLineFancyOutlineConvention(line),
    then: (line) => lineNodes.push(new LineNode(getInlineNodes(line)))
  })) { }

  if (lineNodes.length < 2) {
    return false
  }

  args.then([new LineBlockNode(lineNodes)], consumer.lengthConsumed())
  return true
}
