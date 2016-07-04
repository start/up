import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class BlockquoteNode {
  OUTLINE_SYNTAX_NODE(): void { }
  
  constructor(public children: OutlineSyntaxNode[] = []) { }
  
  private BLOCKQUOTE: any = null
}
