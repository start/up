import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'


export class DescriptionListNode implements OutlineSyntaxNode {
  constructor(public items: DescriptionListNode.Item[]) { }

  OUTLINE_SYNTAX_NODE(): void { }
}


export module DescriptionListNode {
  export class Item {
    constructor(
      public terms: DescriptionListNode.Item.Term[],
      public description: DescriptionListNode.Item.Description) { }
  }


  export module Item {
    export class Term implements InlineSyntaxNodeContainer {
      constructor(public children: InlineSyntaxNode[]) { }

      protected DESCRIPTION_LIST_ITEM_TERM(): void { }
    }

    export class Description implements OutlineSyntaxNodeContainer {
      constructor(public children: OutlineSyntaxNode[]) { }

      protected DESCRIPTION_LIST_ITEM_DESCRIPTION(): void { }
    }
  }
}