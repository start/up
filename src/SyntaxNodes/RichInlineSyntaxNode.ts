import { InlineSyntaxNode } from './InlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'


export abstract class RichInlineSyntaxNode implements InlineSyntaxNode, InlineSyntaxNodeContainer {
  constructor(public children: InlineSyntaxNode[]) { }

  INLINE_SYNTAX_NODE(): void { }
  protected RICH_INLINE_SYNTAX_NODE(): void { }
}
