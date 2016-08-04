import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { concat } from '../CollectionHelpers'


export class DescriptionListNode implements OutlineSyntaxNode {
  constructor(public items: DescriptionListNode.Item[]) { }

  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  childrenToIncludeInTableOfContents(): OutlineSyntaxNode[] {
    return concat(
      this.items.map(item => item.childrenToIncludeInTableOfContents()))
  }
}


export namespace DescriptionListNode {
  export class Item {
    constructor(
      public terms: DescriptionListNode.Item.Term[],
      public description: DescriptionListNode.Item.Description) { }

    childrenToIncludeInTableOfContents(): OutlineSyntaxNode[] {
      return this.description.childrenToIncludeInTableOfContents()
    }
  }

  export namespace Item {
    export class Term extends InlineSyntaxNodeContainer {
      protected DESCRIPTION_LIST_ITEM_TERM(): void { }
    }

    export class Description extends OutlineSyntaxNodeContainer {
      protected DESCRIPTION_LIST_ITEM_DESCRIPTION(): void { }
    }
  }
}
