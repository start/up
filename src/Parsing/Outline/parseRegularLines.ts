import { LineConsumer } from './LineConsumer'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { LineBlock } from '../../SyntaxNodes/LineBlock'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { getInlineNodes } from '../Inline/getInlineNodes'
import { NON_BLANK_PATTERN } from '../Patterns'
import { isLineFancyOutlineConvention } from './isLineFancyOutlineConvention'
import { tryToPromoteToOutline } from './tryToPromoteToOutline'
import { OutlineParserArgs } from './OutlineParserArgs'


// A single non-blank line is treated as a paragraph.
//
// 2 or more consecutive non-blank lines are treated as... lines. Not paragraphs! For example:
//
// Roses are red
// Violets are blue
// Lyrics have line
// And addresses do, too

export function parseRegularLines(args: OutlineParserArgs): void {
  const markupLineConsumer = new LineConsumer(args.markupLines)

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
  // an outline separator streak.
  //
  // However, line blocks are *not* interrupted  by a line if it is merely the beginning of another
  // outline convention. This distinction is actually demonstrated in the example above!
  //
  // "Violets are blue" would be interpreted  as a heading due to the following line. But because
  // line blocks only examine each line individually, the line is accepted.

  const inlineNodesPerRegularLine: InlineSyntaxNode[][] = []

  // If a line consists solely of media conventions, those media conventions are promoted to the
  // outline. Any such line will terminate the parsing of regular lines.
  let inlineNodesPromotedToOutline: OutlineSyntaxNode[] = []

  // We don't need to ensure that the first line would be parsed as a regular paragraph. We already
  // it know would be (that's why this function was called!).
  let isOnFirstLine = true

  while (true) {
    let inlineNodes: InlineSyntaxNode[]

    const wasLineConsumed = markupLineConsumer.consume({
      linePattern: NON_BLANK_PATTERN,
      if: line => isOnFirstLine || !isLineFancyOutlineConvention(line, args.config),
      thenBeforeConsumingLine: line => {
        inlineNodes = getInlineNodes(line, args.config)
      }
    })

    // The line was blank. Let's bail!
    if (!wasLineConsumed) {
      break
    }

    // If a line consists solely of escaped whitespace, it doesn't generate any syntax nodes. We
    // ignore these lines, but they don't terminate line blocks.
    if (!inlineNodes.length) {
      continue
    }

    isOnFirstLine = false

    const nodesFromThisShouldBePlacedDirectlyIntoOutline =
      tryToPromoteToOutline({
        inlineNodes,
        then: outlineNodes => {
          inlineNodesPromotedToOutline = outlineNodes
        }
      })

    if (nodesFromThisShouldBePlacedDirectlyIntoOutline) {
      break
    }

    inlineNodesPerRegularLine.push(inlineNodes)
  }

  const lengthConsumed = markupLineConsumer.countLinesConsumed

  let resultOfAnyRegularLines: Paragraph | LineBlock

  switch (inlineNodesPerRegularLine.length) {
    case 0:
      // If we didn't consume any regular lines, we can't produce a paragraph or a line block.
      args.then(inlineNodesPromotedToOutline, lengthConsumed)
      return

    case 1:
      resultOfAnyRegularLines = new Paragraph(inlineNodesPerRegularLine[0])
      break

    default: {
      const lineBlockLines = inlineNodesPerRegularLine
        .map(inlineNodes => new LineBlock.Line(inlineNodes))

      resultOfAnyRegularLines = new LineBlock(lineBlockLines)
      break
    }
  }

  args.then([resultOfAnyRegularLines, ...inlineNodesPromotedToOutline], lengthConsumed)
}
