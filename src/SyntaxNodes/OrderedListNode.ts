import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class OrderedListNode {
  OUTLINE_SYNTAX_NODE(): void { }

  constructor(public listItems: OrderedListNode.Item[]) { }

  start(): number {
    return this.listItems[0].ordinal
  }

  order(): OrderedListOrder {
    const withExplicitOrdinals =
      this.listItems.filter(item => item.ordinal != null)

    if (withExplicitOrdinals.length < 2) {
      return OrderedListOrder.Ascending
    }

    return (
      withExplicitOrdinals[0].ordinal > withExplicitOrdinals[1].ordinal
        ? OrderedListOrder.Descrending
        : OrderedListOrder.Ascending
    )
  }
}

export enum OrderedListOrder {
  Ascending,
  Descrending
}

export module OrderedListNode {
  export class Item {
    protected ORDERED_LIST_ITEM: any = null

    // During parsing, `ordinal` can be either `null` or a number. Defaulting `ordinal` to `null`
    // rather than `undefined` allows our unit tests to be cleaner.
    constructor(public children: OutlineSyntaxNode[], public ordinal: number = null) { }
  }
}