import { isWhitespace } from '../isWhitespace'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { Link } from '../../SyntaxNodes/Link'
import { MediaSyntaxNode } from '../../SyntaxNodes/MediaSyntaxNode'


// If a line consists solely of media conventions (and/or whitespace), those media conventions are
// placed directly into the outline rather into a paragraph.
//
// If a media convention is "linkified", or if a link otherwise contains only media conventions (and
// whitespace), the link counts as media. In that situation, the link itself is placed directly into
// the outline.
export type InlineSyntaxNodePromotableToOutline =
  MediaSyntaxNode | Link


export function tryToPromoteMediaToOutline(
  args: {
    inlineSyntaxNodes: InlineSyntaxNode[]
    then: (promotedNodes: InlineSyntaxNodePromotableToOutline[]) => void
  }
): boolean {
  const { inlineSyntaxNodes, then } = args
  const promotedNodes: InlineSyntaxNodePromotableToOutline[] = []

  for (const inlineNode of inlineSyntaxNodes) {
    if (inlineNode instanceof MediaSyntaxNode) {
      promotedNodes.push(inlineNode)
      continue
    }

    if (inlineNode instanceof Link) {
      const wasAbleToPromoteChildrenToOutline = tryToPromoteMediaToOutline({
        inlineSyntaxNodes: inlineNode.children,
        then: promotableChildren => {
          promotedNodes.push(new Link(promotableChildren, inlineNode.url))
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
