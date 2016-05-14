import { LineConsumer } from './LineConsumer'
import { isWhitespace } from '../../SyntaxNodes/PlainTextNode'
import { MediaSyntaxNode } from '../../SyntaxNodes/MediaSyntaxNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { Line } from '../../SyntaxNodes/Line'
import { getInlineNodes } from '../Inline/GetInlineNodes'
import { NON_BLANK, STREAK } from '../Patterns'
import { isLineFancyOutlineConvention } from './IsLineFancyOutlineConvention'
import { OutlineParserArgs } from './OutlineParser'


// A single non-blank line is treated as a paragraph.
//
// 2 or more consecutive non-blank lines are treated as... lines. Not paragraphs! For example:
//
// Roses are red
// Violets are blue
// Lyrics have line
// And addresses do, too

export function parseRegularLines(args: OutlineParserArgs): boolean {
  const consumer = new LineConsumer(args.text)

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

  let regularLineNodes: OutlineSyntaxNode[] = []
  let terminatingNodes: OutlineSyntaxNode[] = []

  while (true) {
    let inlineNodes: InlineSyntaxNode[]
    
    const wasLineConsumed = consumer.consumeLine({
      pattern: NON_BLANK_LINE_PATTERN,
      if: (line) => !isLineFancyOutlineConvention(line, args.config),
      then: (line) => inlineNodes = getInlineNodes(line, args.config)
    })
    
    // Sometimes, a non-blank line can produce no syntax nodes. The following non-blank conventions
    // produce no syntax nodes:
    //
    // 1. Empty sandwich conventions
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
    
    // If a media convention is the only convention on a line, we treat it as an outline convention
    // rather than pretending it's a paragraph.
    //
    // If an outline media convention directly follows or precedes a paragraph, the two don't
    // produce a line block. Likewise, if an outline media convention directly follows or precedes a
    // line block, the media convention is not included in the line block 
    //
    // Similarly, if a line consists solely of multiple media conventions, we outline all of them.
    
    const doesLineConsistSolelyOfMediaConventions = (
      inlineNodes.every(node => isWhitespace(node) || isMediaSyntaxNode(node))
      && inlineNodes.some(isMediaSyntaxNode)
    )
    
    if (doesLineConsistSolelyOfMediaConventions) {
      terminatingNodes = <MediaSyntaxNode[]>inlineNodes.filter(isMediaSyntaxNode)
      
      break
    }
    
    inlineNodesPerRegularLine.push(inlineNodes)
  }

  const lengthConsumed = consumer.lengthConsumed()

  switch (inlineNodesPerRegularLine.length) {
    case 0:
      // If we only consumed only 1 line, and if that single line either produced no syntax nodes or
      // consisted solely of a media node, then there aren't any other lines left over to produce a
      // a paragraph or a line block.
      break;

    case 1:
      regularLineNodes = [new ParagraphNode(inlineNodesPerRegularLine[0])]
      break

    default: {
      const lineBlockLines = inlineNodesPerRegularLine.map(inlineNodes => new Line(inlineNodes))
      regularLineNodes = [new LineBlockNode(lineBlockLines)]
      break
    }
  }

  args.then(regularLineNodes.concat(terminatingNodes), consumer.lengthConsumed())
  return true
}


function isMediaSyntaxNode(node: InlineSyntaxNode): boolean {
  return node instanceof MediaSyntaxNode
}


const NON_BLANK_LINE_PATTERN = new RegExp(
  NON_BLANK)

const STREAK_PATTERN = new RegExp(
  STREAK)
