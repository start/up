import { NON_BLANK_PATTERN } from '../../Patterns'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { LineBlock } from '../../SyntaxNodes/LineBlock'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { getInlineSyntaxNodes } from '../Inline/getInlineSyntaxNodes'
import { isLineFancyOutlineConvention } from './isLineFancyOutlineConvention'
import { LineConsumer } from './LineConsumer'
import { OutlineParserArgs } from './OutlineParserArgs'
import { OutlineParseResult } from './OutlineParseResult'
import { tryToPromoteMediaToOutline } from './tryToPromoteMediaToOutline'


// A single non-blank line is treated as a paragraph, while a block of consecutive non-blank
// lines is treated as a line block.
//
// Here's an example of a line block:
//
//   Roses are red
//   Violets are blue
//   Lyrics have lines
//   And addresses do, too
export function parseParagraphOrLineBlock(args: OutlineParserArgs): OutlineParseResult {
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
  //      Roses are red
  //      Violets are blue
  //      =*=*=*=*=*=*=*=*=*=*=*=
  //      Anyway, poetry is pretty fun.
  //
  //    Only the first two lines are included in the line block, because the third line is parsed
  //    as a thematic break.
  //
  //    We leave these terminating lines behind to be examined by another parser.
  //
  // 3. A line consisting solely of media conventions:
  //
  //      [image: cautious cat](example.com/cat.jpg) [video: puppies playing](example.com/dog.jpg)
  //
  //    Or a line consisting solely of media conventions that serve as links:
  //
  //      [image: a cat](example.com/cat.jpg) (example.com/cat-gallery)
  //
  //    These lines are a bit special. Not only do they terminate the preceding line block, but
  //    we "promote" their media conventions to the outline.

  const inlineSyntaxNodesPerLine: InlineSyntaxNode[][] = []

  // Normally, we need to determine whether each line should be interpreted as another outline
  // convention instead of a paragraph or line block (see list item 2 above).
  //
  // That's a bit expensive.
  //
  // Luckily, we can avoid doing this for the first line. If the first line were able to satisfy
  // another outline convention, another parser would have already consumed it!
  let isOnFirstLine = true

  while (!markupLineConsumer.done) {
    const lineResult =
      markupLineConsumer.consumeLineIfMatches(NON_BLANK_PATTERN, {
        andIf: result => isOnFirstLine || !isLineFancyOutlineConvention(result.line, args.settings)
      })

    if (!lineResult) {
      // The current line is blank, or it should be interpreted as another outline convention.
      //
      // Let's bail!
      break
    }

    isOnFirstLine = false
    const inlineSyntaxNodes = getInlineSyntaxNodes(lineResult.line, args.settings)

    // If a line consists solely of escaped whitespace, it doesn't generate any syntax nodes. We
    // ignore these lines, but they don't terminate anything.
    if (!inlineSyntaxNodes.length) {
      continue
    }

    // Before we include the current line in our paragraph or line block, let's make sure the line
    // didn't conssist solely of media conventions (see list item 3 above).
    let mediaPromotedToOutline: OutlineSyntaxNode[] = []

    tryToPromoteMediaToOutline({
      inlineSyntaxNodes,
      then: outlineNodes => {
        mediaPromotedToOutline = outlineNodes
      }
    })

    if (mediaPromotedToOutline.length) {
      // We're done! Let's include the promoted media nodes in our result.
      return {
        parsedNodes: getAppropriateOutlineNodes(inlineSyntaxNodesPerLine, mediaPromotedToOutline),
        countLinesConsumed: markupLineConsumer.countLinesConsumed
      }
    }

    // The current line survived the gauntlet!
    inlineSyntaxNodesPerLine.push(inlineSyntaxNodes)
  }

  return {
    parsedNodes: getAppropriateOutlineNodes(inlineSyntaxNodesPerLine),
    countLinesConsumed: markupLineConsumer.countLinesConsumed
  }
}


function getAppropriateOutlineNodes(
  inlineSyntaxNodesPerLine: InlineSyntaxNode[][],
  mediaPromotedToOutline: OutlineSyntaxNode[] = []
): OutlineSyntaxNode[] {
  let outlineNodes: OutlineSyntaxNode[]

  switch (inlineSyntaxNodesPerLine.length) {
    case 0:
      // We can't produce a paragraph or line block from zero lines.
      outlineNodes = []
      break

    case 1:
      outlineNodes = [new Paragraph(inlineSyntaxNodesPerLine[0])]
      break

    default:
      const lineBlockLines =
        inlineSyntaxNodesPerLine.map(inlineNodes =>
          new LineBlock.Line(inlineNodes))

      outlineNodes = [new LineBlock(lineBlockLines)]
      break
  }

  return outlineNodes.concat(mediaPromotedToOutline)
}
