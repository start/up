import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { Heading } from './Heading'
import { concat } from '../CollectionHelpers'


export class OrderedList implements OutlineSyntaxNode {
  constructor(
    public items: OrderedList.Item[],
    public sourceLineNumber: number = undefined) { }

  start(): number {
    return this.items[0].ordinal
  }

  order(): OrderedList.Order {
    const withExplicitOrdinals =
      this.items.filter(item => item.ordinal != null)

    if (withExplicitOrdinals.length < 2) {
      return OrderedList.Order.Ascending
    }

    return (
      withExplicitOrdinals[0].ordinal > withExplicitOrdinals[1].ordinal
        ? OrderedList.Order.Descrending
        : OrderedList.Order.Ascending)
  }

  descendantHeadingsToIncludeInTableOfContents(): Heading[] {
    return concat(
      this.items.map(item => item.descendantHeadingsToIncludeInTableOfContents()))
  }
}


export namespace OrderedList {
  export class Item extends OutlineSyntaxNodeContainer {
    constructor(public children: OutlineSyntaxNode[], public ordinal?: number) {
      super(children)
    }

    protected ORDERED_LIST_ITEM(): void { }
  }

  export enum Order {
    Ascending = 1,
    Descrending
  }
}
