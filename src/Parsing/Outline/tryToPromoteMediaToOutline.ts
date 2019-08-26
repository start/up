import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { Link } from '../../SyntaxNodes/Link'
import { MediaSyntaxNode } from '../../SyntaxNodes/MediaSyntaxNode'
import { isWhitespace } from '../isWhitespace'


// If a line consists solely of media conventions (and/or whitespace), those media conventions are
// placed directly into the outline rather into a paragraph.
//
// If a media convention is "linkified", or if a link otherwise contains only media conventions (and
// whitespace), the link counts as media. In that situation, the link itself is placed directly into
// the outline, minus any whitespace.
export type InlineSyntaxNodePromotableToOutline =
  MediaSyntaxNode | Link


export function tryToPromoteMediaToOutline(
  inlineSyntaxNodes: InlineSyntaxNode[]
): null | InlineSyntaxNodePromotableToOutline[] {
  const promotedNodes: InlineSyntaxNodePromotableToOutline[] = []

  for (const inlineNode of inlineSyntaxNodes) {
    if (inlineNode instanceof MediaSyntaxNode) {
      promotedNodes.push(inlineNode)
      continue
    }

    if (inlineNode instanceof Link) {
      const linkedPromotableChildren = tryToPromoteMediaToOutline(inlineNode.children)

      if (!linkedPromotableChildren) {
        return null
      }

      // By creating a new link node, we omit any whitespace the existing link held.
      promotedNodes.push(new Link(linkedPromotableChildren, inlineNode.url))

      continue
    }

    if (!isWhitespace(inlineNode)) {
      return null
    }
  }

  return promotedNodes.length
    ? promotedNodes
    : null
}
