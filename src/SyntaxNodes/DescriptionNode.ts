import { SyntaxNode } from './SyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'

export class DescriptionNode extends SyntaxNode {
  constructor(public children: OutlineSyntaxNode[]) {
    super()
  }
  
  private DESCRIPTION: any = null
}