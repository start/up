import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class UnorderedListNode implements OutlineSyntaxNode {
  constructor(public items: UnorderedListNode.Item[]) { }
  
  OUTLINE_SYNTAX_NODE(): void { }
}

export module UnorderedListNode {
  export class Item {
    constructor(public children: OutlineSyntaxNode[]) { }

    protected UNORDERED_LIST_ITEM(): void { }
  }
}