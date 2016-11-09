import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Document } from './Document'
import { concat } from '../CollectionHelpers'
import { Renderer } from '../Rendering/Renderer'


export class NumberedList implements OutlineSyntaxNode {
  public sourceLineNumber: number = undefined

  constructor(public items: NumberedList.Item[], options?: { sourceLineNumber: number }) {
    if (options) {
      this.sourceLineNumber = options.sourceLineNumber
    }
  }

  start(): number {
    return this.items[0].ordinal
  }

  order(): NumberedList.Order {
    const withExplicitOrdinals =
      this.items.filter(item => item.ordinal != null)

    if (withExplicitOrdinals.length < 2) {
      return NumberedList.Order.Ascending
    }

    return (
      withExplicitOrdinals[0].ordinal > withExplicitOrdinals[1].ordinal
        ? NumberedList.Order.Descending
        : NumberedList.Order.Ascending)
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
    public ordinal: number = undefined

    constructor(public children: OutlineSyntaxNode[], options?: { ordinal: number }) {
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
