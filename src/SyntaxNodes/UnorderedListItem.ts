import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class UnorderedListItem {
  protected UNORDERED_LIST_ITEM: any = null

  constructor(public children: OutlineSyntaxNode[]) { }
}
