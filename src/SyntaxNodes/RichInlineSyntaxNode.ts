import { InlineSyntaxNode } from '../SyntaxNodes/InlineSyntaxNode'


export interface RichInlineSyntaxNodeType {
  new (children: InlineSyntaxNode[]): RichInlineSyntaxNode
}

export abstract class RichInlineSyntaxNode {  
  INLINE_SYNTAX_NODE(): void { }
  protected RICH_INLINE_SYNTAX_NODE(): void { }

  constructor(public children: InlineSyntaxNode[]) { }
}
