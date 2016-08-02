import { isWhitespace } from '../isWhitespace'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { MediaSyntaxNode } from '../../SyntaxNodes/MediaSyntaxNode'


// If a line consists solely of media conventions (and/or whitespace), those media conventions are
// placed directly into the outline rather into a paragraph.
//
// If a media convention is "linkified", or if a link otherwise contains only media conventions (and
// whitespace), the link counts as media. In that situation, the link itself is placed directly into
// the outline.
export type InlineSyntaxNodePromotableToOutline =
  MediaSyntaxNode | LinkNode


export function tryToPromoteToOutline(
  args: {
    inlineNodes: InlineSyntaxNode[]
    then: (promotedNodes: InlineSyntaxNodePromotableToOutline[]) => void
  }
): boolean {
  const { inlineNodes, then } = args
  const promotedNodes: InlineSyntaxNodePromotableToOutline[] = []

  for (const inlineNode of inlineNodes) {
    if (inlineNode instanceof MediaSyntaxNode) {
      promotedNodes.push(inlineNode)
      continue
    }

    if (inlineNode instanceof LinkNode) {
      const wasAbleToPromoteChildrenToOutline = tryToPromoteToOutline({
        inlineNodes: inlineNode.children,
        then: promotableChildren => {
          promotedNodes.push(new LinkNode(promotableChildren, inlineNode.url))
        }
      })

      if (!wasAbleToPromoteChildrenToOutline) {
        return false
      }

      continue
    }

    if (!isWhitespace(inlineNode)) {
      return false
    }
  }

  if (promotedNodes.length) {
    then(promotedNodes)
    return true
  }

  return false
}
