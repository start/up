import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Document } from './Document'
import { concat } from '../CollectionHelpers'
import { Renderer } from '../Rendering/Renderer'


export class NumberedList implements OutlineSyntaxNode {
  sourceLineNumber: number | undefined = undefined

  constructor(public items: NumberedList.Item[], options?: { sourceLineNumber: number }) {
    if (options) {
      this.sourceLineNumber = options.sourceLineNumber
    }
  }

  start(): number | undefined {
    return this.items[0].ordinal
  }

  order(): NumberedList.Order {
    const [firstOrdinal, secondOrdinal] =
      this.items
        .filter(item => item.ordinal != null)
        .map(item => item.ordinal)

    const firstTwoOrdinalsAreDescending =
      firstOrdinal != null
      && secondOrdinal != null
      && firstOrdinal > secondOrdinal

    return firstTwoOrdinalsAreDescending
      ? NumberedList.Order.Descending
      : NumberedList.Order.Ascending
  }

  descendantsToIncludeInTableOfContents(): Document.TableOfContents.Entry[] {
    return concat(
      this.items.map(item => item.descendantsToIncludeInTableOfContents()))
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return concat(
      this.items.map(item => item.inlineDescendants()))
  }

  render(renderer: Renderer): string {
    return renderer.numberedList(this)
  }
}


export namespace NumberedList {
  export class Item extends OutlineSyntaxNodeContainer {
    public ordinal: number | undefined = undefined

    constructor(public children: OutlineSyntaxNode[], options?: { ordinal?: number }) {
      super(children)

      if (options) {
        this.ordinal = options.ordinal
      }
    }

    protected NUMBERED_LIST_ITEM(): void { }
  }

  export enum Order {
    Ascending = 1,
    Descending
  }
}
