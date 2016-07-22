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
      protected DESCRIPTION_LIST_ITEM_TERM: any = null

      constructor(public children: InlineSyntaxNode[]) { }
    }

    export class Description {
      protected DESCRIPTION_LIST_ITEM_DESCRIPTION: any = null

      constructor(public children: OutlineSyntaxNode[]) { }
    }
  }
}