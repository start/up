import { InlineSyntaxNode } from './InlineSyntaxNode'


export abstract class RichInlineSyntaxNode implements InlineSyntaxNode {
  constructor(public children: InlineSyntaxNode[]) { }

  INLINE_SYNTAX_NODE(): void { }
  protected RICH_INLINE_SYNTAX_NODE(): void { }
}
