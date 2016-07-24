import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'


export class OrderedListNode implements OutlineSyntaxNode {
  constructor(public items: OrderedListNode.Item[]) { }

  start(): number {
    return this.items[0].ordinal
  }

  order(): OrderedListNode.Order {
    const withExplicitOrdinals =
      this.items.filter(item => item.ordinal != null)

    if (withExplicitOrdinals.length < 2) {
      return OrderedListNode.Order.Ascending
    }

    return (
      withExplicitOrdinals[0].ordinal > withExplicitOrdinals[1].ordinal
        ? OrderedListNode.Order.Descrending
        : OrderedListNode.Order.Ascending)
  }

  OUTLINE_SYNTAX_NODE(): void { }
}


export namespace OrderedListNode {
  export class Item extends OutlineSyntaxNodeContainer {
    // During parsing, `ordinal` can be either `null` or a number. Defaulting `ordinal` to `null`
    // rather than `undefined` allows our unit tests to be cleaner.
    constructor(public children: OutlineSyntaxNode[], public ordinal: number = null) {
      super(children)
    }

    protected ORDERED_LIST_ITEM(): void { }
  }

  export enum Order {
    Ascending = 1,
    Descrending
  }
}
