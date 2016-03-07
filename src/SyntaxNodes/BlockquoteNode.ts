import { OutlineSyntaxNode } from './OutlineSyntaxNode'

export class BlockquoteNode extends OutlineSyntaxNode {
  constructor(public children: OutlineSyntaxNode[] = []) {
    super()
  }
  
  private BLOCKQUOTE: any = null
}