import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { SyntaxNode } from './SyntaxNode'

export class DocumentNode extends SyntaxNode {
  constructor(public children: OutlineSyntaxNode[] = []) {
    super()
  }
  
  private DOCUMENT: any = null
}