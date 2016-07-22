import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'


export class DescriptionListNode {
  OUTLINE_SYNTAX_NODE(): void { }

  constructor(public listItems: DescriptionListNode.Item[]) { }
}


export module DescriptionListNode {
  export class Item {
    constructor(
      public terms: DescriptionListNode.Item.Term[],
      public description: DescriptionListNode.Item.Description) { }
  }


  export module Item {
    export class Term {
      constructor(public children: InlineSyntaxNode[]) { }

      protected DESCRIPTION_LIST_ITEM_TERM(): void { }
    }

    export class Description {
      constructor(public children: OutlineSyntaxNode[]) { }

      protected DESCRIPTION_LIST_ITEM_DESCRIPTION(): void { }
    }
  }
}