import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { UpDocument } from './UpDocument'
import { concat } from '../CollectionHelpers'


export class DescriptionList implements OutlineSyntaxNode {
  constructor(
    public items: DescriptionList.Item[],
    public sourceLineNumber: number = undefined) { }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return concat(
      this.items.map(item => item.descendantsToIncludeInTableOfContents()))
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return concat(
      this.items.map(item => item.inlineDescendants()))
  }
}


export namespace DescriptionList {
  export class Item {
    constructor(
      public terms: DescriptionList.Item.Term[],
      public description: DescriptionList.Item.Description) { }

    descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
      return this.description.descendantsToIncludeInTableOfContents()
    }

    inlineDescendants(): InlineSyntaxNode[] {
      return concat([
        ...this.terms,
        this.description
      ].map(termOrDescription => termOrDescription.inlineDescendants()))
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
