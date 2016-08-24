import { LineConsumer } from './LineConsumer'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { LineBlock } from '../../SyntaxNodes/LineBlock'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { getInlineSyntaxNodes } from '../Inline/getInlineSyntaxNodes'
import { NON_BLANK_PATTERN } from '../Patterns'
import { isLineFancyOutlineConvention } from './isLineFancyOutlineConvention'
import { tryToPromoteMediaToOutline } from './tryToPromoteMediaToOutline'
import { OutlineParserArgs } from './OutlineParserArgs'


// A single non-blank line is treated as a paragraph.
//
// A block of 2 or more non-blank lines are treated as... a block of lines. Not as paragraphs!
//
// For example:
//
// Roses are red
// Violets are blue
// Lyrics have lines
// And addresses do, too
export function parseParagraphOrLineBlock(args: OutlineParserArgs): void {
  const markupLineConsumer = new LineConsumer(args.markupLines)

  // We're going to keep gobbling lines until we encounter a terminating line (listed below).
  // Naturally, a terminating line ends the line block (and/or prevents a paragraph from
  // growing into a line block).
  //
  // The terminating line itself is **not** included in the line block.
  //
  // Here are the three types of terminating lines:
  //
  // 1. A blank line. We leave blank lines behind to be examined by another parser, like
  // `tryToParseBlankLineSeparation`.
  //
  // 2. A line that would otherwise be interpreted as another outline convention.
  //
  //    For example:
  //
  //    Roses are red
  //    Violets are blue
  //    =*=*=*=*=*=*=*=*=*=*=*=
  //    Anyway, poetry is pretty fun.
  //
  //    Only the first two lines are included in the line block, because the third line is parsed
  //    as a thematic break.
  //
  //    We leave these terminating lines behind to be examined by another parser.
  //
  // 3. A line consisting solely of media conventions:
  //
  //    [image: cautious cat](example.com/cat.jpg) [video: puppies playing](example.com/dog.jpg)
  //
  //    Or a line consisting solely of media conventions that serve as links:
  //
  //    [image: a cat](example.com/cat.jpg) (example.com/cat-gallery)
  //
  //    These lines are a bit special. Not only do they terminate the preceding line block, but
  //    we "promote" their media conventions to the outline.

  const inlineNodesPerLine: InlineSyntaxNode[][] = []
  let nodesPromotedToOutline: OutlineSyntaxNode[] = []

  // Normally, we need to determine whether each line should be interpreted as another outline
  // convention instead of a paragraph or line block (see list item 2 above).
  //
  // This is a bit expensive.
  //
  // Luckily, we can avoid doing this for the first line. If the first line satisfied another
  // outline convention, another parser would have already consumed it!
  let isOnFirstLine = true

  while (true) {
    let inlineNodes: InlineSyntaxNode[]

    const wasLineConsumed = markupLineConsumer.consume({
      linePattern: NON_BLANK_PATTERN,
      if: line => isOnFirstLine || !isLineFancyOutlineConvention(line, args.config),
      thenBeforeConsumingLine: line => {
        inlineNodes = getInlineSyntaxNodes(line, args.config)
      }
    })

    isOnFirstLine = false

    if (!wasLineConsumed) {
      // The current line is blank, or it should be interpreted as another outline convention.
      //
      // Let's bail!
      break
    }

    // If a line consists solely of escaped whitespace, it doesn't generate any syntax nodes. We
    // ignore these lines, but they don't terminate anything.
    if (!inlineNodes.length) {
      continue
    }

    // Before we include the current line in our paragraph or line block, let's make sure the line
    // didn't conssist solely of media conventions (see list item 3 above).
    tryToPromoteMediaToOutline({
      inlineNodes,
      then: outlineNodes => {
        nodesPromotedToOutline = outlineNodes
      }
    })

    if (nodesPromotedToOutline.length) {
      break
    }

    inlineNodesPerLine.push(inlineNodes)
  }

  const lengthConsumed = markupLineConsumer.countLinesConsumed

  let resultOfAnyRegularLines: Paragraph | LineBlock

  switch (inlineNodesPerLine.length) {
    case 0:
      // We can't produce a paragraph or line block from zero lines. We're done!
      args.then(nodesPromotedToOutline, lengthConsumed)
      return

    case 1:
      resultOfAnyRegularLines = new Paragraph(inlineNodesPerLine[0])
      break

    default: {
      const lineBlockLines = inlineNodesPerLine
        .map(inlineNodes => new LineBlock.Line(inlineNodes))

      resultOfAnyRegularLines = new LineBlock(lineBlockLines)
      break
    }
  }

  args.then([resultOfAnyRegularLines, ...nodesPromotedToOutline], lengthConsumed)
}
