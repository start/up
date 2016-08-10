import { LineConsumer } from './LineConsumer'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
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

    // If a line consisted solely of a single backslash, it doesn't generate any syntax nodes. We
    // consider those lines to be blank.
    if (!wasLineConsumed || !inlineNodes.length) {
      break
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

  let resultOfAnyRegularLines: ParagraphNode | LineBlockNode

  switch (inlineNodesPerRegularLine.length) {
    case 0:
      // If we only consumed only 1 line, and if that single line either produced no inline syntax
      // nodes or was promoted to the outline, then there won't any other lines left over to produce
      // a paragraph or a line block.
      args.then(inlineNodesPromotedToOutline, lengthConsumed)
      return

    case 1:
      resultOfAnyRegularLines = new ParagraphNode(inlineNodesPerRegularLine[0])
      break

    default: {
      const lineBlockLines = inlineNodesPerRegularLine
        .map(inlineNodes => new LineBlockNode.Line(inlineNodes))

      resultOfAnyRegularLines = new LineBlockNode(lineBlockLines)
      break
    }
  }

  args.then([resultOfAnyRegularLines, ...inlineNodesPromotedToOutline], lengthConsumed)
}
