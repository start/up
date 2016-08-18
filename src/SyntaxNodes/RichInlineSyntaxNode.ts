import { InlineSyntaxNode } from './InlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { getInlineTextContent } from './getInlineTextContent'


export abstract class RichInlineSyntaxNode extends InlineSyntaxNodeContainer implements InlineSyntaxNode {
  inlineTextContent(): string {
    return getInlineTextContent(this.children)
  }
}
