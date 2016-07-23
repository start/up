import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class OrderedListNode implements OutlineSyntaxNode {
  constructor(public listItems: OrderedListNode.Item[]) { }

  start(): number {
    return this.listItems[0].ordinal
  }

  order(): OrderedListNode.Order {
    const withExplicitOrdinals =
      this.listItems.filter(item => item.ordinal != null)

    if (withExplicitOrdinals.length < 2) {
      return OrderedListNode.Order.Ascending
    }

    return (
      withExplicitOrdinals[0].ordinal > withExplicitOrdinals[1].ordinal
        ? OrderedListNode.Order.Descrending
        : OrderedListNode.Order.Ascending
    )
  }

  OUTLINE_SYNTAX_NODE(): void { }
}


export module OrderedListNode {
  export class Item {
    // During parsing, `ordinal` can be either `null` or a number. Defaulting `ordinal` to `null`
    // rather than `undefined` allows our unit tests to be cleaner.
    constructor(public children: OutlineSyntaxNode[], public ordinal: number = null) { }

    protected ORDERED_LIST_ITEM(): void { }
  }

  export enum Order {
    Ascending = 1,
    Descrending
  }
}