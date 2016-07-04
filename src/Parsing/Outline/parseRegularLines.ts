import { LineConsumer } from './LineConsumer'
import { isWhitespace } from '../isWhitespace'
import { MediaSyntaxNode } from '../../SyntaxNodes/MediaSyntaxNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { Line } from '../../SyntaxNodes/Line'
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
  const consumer = new LineConsumer(args.lines)

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
  // However, line blocks are *not* interrupted  by a line if it is merely the beginning of another
  // outline convention. This distinction is actually demonstrated in the example above!
  //
  // "Violets are blue" would be interpreted  as a heading due to the following line. But because
  // line blocks only examine each line individually, the line is accepted.
  //
  // TODO: Handle code blocks and description lists?

  const inlineNodesPerRegularLine: InlineSyntaxNode[][] = []
  let terminatingNodes: OutlineSyntaxNode[] = []

  // We don't need to ensure that the first line would be parsed as a regular paragraph. We already
  // it know would be (that's why this function was called!). 
  let isOnFirstLine = true

  while (true) {
    let inlineNodes: InlineSyntaxNode[]

    const wasLineConsumed = consumer.consume({
      linePattern: NON_BLANK_PATTERN,
      if: line => isOnFirstLine || !isLineFancyOutlineConvention(line, args.config),
      then: line => inlineNodes = getInlineNodes(line, args.config)
    })

    isOnFirstLine = false

    // Sometimes, a non-blank line can produce no syntax nodes. The following non-blank conventions
    // produce no syntax nodes:
    //
    // 1. Empty sandwich conventions (e.g. revision insertion)
    // 2. Empty inline code
    // 3. Media conventions missing their URL
    // 4. Links missing their content and their URL
    //
    // If we're bizarrely dealing with a line consisting solely of those "dud" conventions, then
    // `inlineNodes` will be empty. We don't want to produce empty paragraphs for these lines, and
    // we're happy to have these lines terminate a preceeding line block.
    //
    // In the future, we might change this behavior. A line producing no syntax nodes might simply
    // be ignored, which means it would not terminate a line block if the block continues immediately
    // afterward.

    if (!wasLineConsumed || !inlineNodes.length) {
      break
    }

    const nodesFromThisShouldBePlacedDirectlyIntoOutline =
      tryToPromoteToOutline({
        inlineNodes,
        then: outlineNodes => {
          terminatingNodes = outlineNodes
        }
      })

    if (nodesFromThisShouldBePlacedDirectlyIntoOutline) {
      break
    }

    inlineNodesPerRegularLine.push(inlineNodes)
  }

  const lengthConsumed = consumer.countLinesConsumed

  let regularLinesResultNode: OutlineSyntaxNode

  switch (inlineNodesPerRegularLine.length) {
    case 0:
      // If we only consumed only 1 line, and if that single line either produced no inline syntax
      // nodes or was promoted to the outline, then there won't any other lines left over to produce
      // a paragraph or a line block.
      args.then(terminatingNodes, lengthConsumed)
      return

    case 1:
      regularLinesResultNode = new ParagraphNode(inlineNodesPerRegularLine[0])
      break

    default: {
      const lineBlockLines = inlineNodesPerRegularLine.map(inlineNodes => new Line(inlineNodes))
      regularLinesResultNode = new LineBlockNode(lineBlockLines)
      break
    }
  }

  args.then([regularLinesResultNode].concat(terminatingNodes), lengthConsumed)
}
