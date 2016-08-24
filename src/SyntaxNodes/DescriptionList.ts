import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { UpDocument } from './UpDocument'
import { concat } from '../CollectionHelpers'
import { Renderer } from '../Rendering/Renderer'


export class DescriptionList implements OutlineSyntaxNode {
  public sourceLineNumber: number = undefined

  constructor(public items: DescriptionList.Item[], options?: { sourceLineNumber: number }) {
    if (options) {
      this.sourceLineNumber = options.sourceLineNumber
    }
  }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return concat(
      this.items.map(item => item.descendantsToIncludeInTableOfContents()))
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return concat(
      this.items.map(item => item.inlineDescendants()))
  }

  render(renderer: Renderer): string {
    return renderer.descriptionList(this)
  }
}


export namespace DescriptionList {
  export class Item {
    constructor(
      public subjects: DescriptionList.Item.Subject[],
      public description: DescriptionList.Item.Description) { }

    descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
      return this.description.descendantsToIncludeInTableOfContents()
    }

    inlineDescendants(): InlineSyntaxNode[] {
      return concat([
        ...this.subjects,
        this.description
      ].map(subjectOrDescription => subjectOrDescription.inlineDescendants()))
    }
  }

  export namespace Item {
    export class Subject extends InlineSyntaxNodeContainer {
      protected DESCRIPTION_LIST_ITEM_SUBJECT(): void { }
    }

    export class Description extends OutlineSyntaxNodeContainer {
      protected DESCRIPTION_LIST_ITEM_DESCRIPTION(): void { }
    }
  }
}
