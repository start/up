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
      const canPromoteLinkChildrenToOutline = tryToPromoteToOutline({
        inlineNodes: inlineNode.children,
        then: promotableChildren => {
          promotedNodes.push(new LinkNode(promotableChildren, inlineNode.url))
        }
      })

      if (!canPromoteLinkChildrenToOutline) {
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