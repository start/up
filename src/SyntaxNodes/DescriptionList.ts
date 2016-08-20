import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { Heading } from './Heading'
import { concat } from '../CollectionHelpers'


export class DescriptionList implements OutlineSyntaxNode {
  constructor(
    public items: DescriptionList.Item[],
    public sourceLineNumber: number = undefined) { }

  descendantHeadingsToIncludeInTableOfContents(): Heading[] {
    return concat(
      this.items.map(item => item.descendantHeadingsToIncludeInTableOfContents()))
  }
}


export namespace DescriptionList {
  export class Item {
    constructor(
      public terms: DescriptionList.Item.Term[],
      public description: DescriptionList.Item.Description) { }

    descendantHeadingsToIncludeInTableOfContents(): Heading[] {
      return this.description.descendantHeadingsToIncludeInTableOfContents()
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
