import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export abstract class RichOutlineSyntaxNode implements OutlineSyntaxNode {
  constructor(public children: OutlineSyntaxNode[]) { }

  OUTLINE_SYNTAX_NODE(): void { }
  protected RICH_OUTLINE_SYNTAX_NODE(): void { }
}
