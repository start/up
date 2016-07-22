import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class UnorderedListNode {
  OUTLINE_SYNTAX_NODE(): void { }

  constructor(public listItems: UnorderedListNode.Item[]) { }

}

export module UnorderedListNode {
  export class Item {
    protected UNORDERED_LIST_ITEM: any = null

    constructor(public children: OutlineSyntaxNode[]) { }
  }
}