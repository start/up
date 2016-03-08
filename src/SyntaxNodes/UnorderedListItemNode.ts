import { OutlineSyntaxNode } from './OutlineSyntaxNode'

export class UnorderedListItemNode {
  constructor(public children: OutlineSyntaxNode[]) { }
  
  private UNORDERED_LIST_ITEM: any = null
}