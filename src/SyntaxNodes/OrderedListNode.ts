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

  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }
}


export namespace OrderedListNode {
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
