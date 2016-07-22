import { InlineSyntaxNode } from './InlineSyntaxNode'


export abstract class RichInlineSyntaxNode {
  INLINE_SYNTAX_NODE(): void { }

  constructor(public children: InlineSyntaxNode[]) { }

  protected RICH_INLINE_SYNTAX_NODE(): void { }
}
