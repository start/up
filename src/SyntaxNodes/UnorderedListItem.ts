import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class UnorderedListItem {
  constructor(public children: OutlineSyntaxNode[]) { }

  private UNORDERED_LIST_ITEM: any = null
}
