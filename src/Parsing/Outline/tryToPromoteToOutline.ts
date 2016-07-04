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
import { OutlineParserArgs } from './OutlineParserArgs'


// TODO: Clean up

export function tryToPromoteToOutline(
  args: {
    inlineNodes: InlineSyntaxNode[]
    then: (outlineNodes: OutlineSyntaxNode[]) => void
  }
): boolean {
  const { inlineNodes, then } = args
// If a media convention is the only convention on a line, we treat it as an outline convention
    // rather than pretending it's a paragraph.
    //
    // If an outline media convention directly follows or precedes a paragraph, the two don't
    // produce a line block. Likewise, if an outline media convention directly follows or precedes a
    // line block, the media convention is not included in the line block 
    //
    // Similarly, if a line consists solely of multiple media conventions (and optional whitespace),
    // we outline all of them.

    const doesLineConsistSolelyOfMediaConventions =
      inlineNodes.every(node => isMediaSyntaxNode(node) || isWhitespace(node))
      && inlineNodes.some(isMediaSyntaxNode)

    if (doesLineConsistSolelyOfMediaConventions) {
      then(<OutlineSyntaxNode[]><any>withoutWhitespace(inlineNodes))
      return true
    }

    return false
}


function isMediaSyntaxNode(node: InlineSyntaxNode): boolean {
  // If a line consists solely of media conventions (and/or whitespace), those media conventions are
  // placed directly into the outline rather into a paragraph.
  //
  // If an image is "linkified", or if a link otherwise contains only images (and whitespace), the link
  // counts as an image for the purpose of the rule above. In that situation, the link itself is placed
  // directly into the outline.
  return (
    node instanceof MediaSyntaxNode
    || (
      node instanceof LinkNode
      // A link node cannot consist solely of whitespace, so if `every` returns true, we know there's
      // at least one image node within the link.
      && node.children.every(child => (child instanceof ImageNode) || isWhitespace(child))))
}

// This function assumes any plain text nodes are whitespace.
function withoutWhitespace(nodes: InlineSyntaxNode[]): InlineSyntaxNode[] {
  return (
    nodes
      .filter(node =>
        !(node instanceof PlainTextNode))
      .map(node =>
        (node instanceof LinkNode) ? new LinkNode(withoutWhitespace(node.children), node.url) : node))
}