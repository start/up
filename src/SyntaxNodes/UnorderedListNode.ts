import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class UnorderedListNode {
  OUTLINE_SYNTAX_NODE(): void { }

  constructor(public listItems: UnorderedListNode.Item[]) { }
}

export module UnorderedListNode {
  export class Item {
    constructor(public children: OutlineSyntaxNode[]) { }

    protected UNORDERED_LIST_ITEM(): void { }
  }
}