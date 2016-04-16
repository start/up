import { TextConsumer } from '../TextConsumer'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
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

// A single non-blank line is treated as a paragraph.
//
// 2 or more consecutive non-blank lines are treated as... lines. Not paragraphs! For example:
//
// Roses are red
// Violets are blue
// Lyrics have line
// And address do, too

export function parseRegularLines(args: OutlineParserArgs): boolean {
  const consumer = new TextConsumer(args.text)

  // Line blocks are terminated early by a line if it wouldn't tbe parsed as a regular paragraph.
  //
  // For example:
  //
  // Roses are red
  // Violets are blue
  // =*=*=*=*=*=*=*=*=*=*=*=
  // Anyway, poetry is pretty fun.
  //
  // Only the first two lines are included in the line block, because the third line is parsed as
  // a section separator streak.
  //
  // However, line blocks are *not* interupted by a line if it is merely the beginning of another
  // outline convention. This distinction is actually demonstrated in the example above!
  //
  // "Violets are blue" would be interepreted as a heading due to the following line. But because
  // line blocks only examine each line individually, the line is accepted.
  //
  // TODO: Handle code blocks and description lists?
  const inlineNodesPerLine: InlineSyntaxNode[][] = []

  while (consumer.consumeLine({
    pattern: NON_BLANK_LINE_PATTERN,
    if: (line) => !isLineFancyOutlineConvention(line),
    then: (line) => inlineNodesPerLine.push(getInlineNodes(line))
  })) { }

  const lengthConsumed = consumer.lengthConsumed()
  let nodes: OutlineSyntaxNode[]

  switch (inlineNodesPerLine.length) {
    case 1:
      nodes = [new ParagraphNode(inlineNodesPerLine[0])]
      break

    default: {
      const lineBlockLines = inlineNodesPerLine.map(inlineNodes => new Line(inlineNodes))
      nodes = [new LineBlockNode(lineBlockLines)]
      break
    }
  }

  args.then(nodes, consumer.lengthConsumed())
  return true
}
