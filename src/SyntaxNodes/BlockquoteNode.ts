import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class BlockquoteNode {
  OUTLINE_SYNTAX_NODE(): void { }
  protected BLOCKQUOTE: any = null
  
  constructor(public children: OutlineSyntaxNode[] = []) { }
}
