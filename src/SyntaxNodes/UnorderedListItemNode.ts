import { SyntaxNode } from './SyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'

export class UnorderedListItemNode extends SyntaxNode {
  constructor(public children: OutlineSyntaxNode[]) {
    super()
  }
  
  private UNORDERED_LIST_ITEM: any = null
}