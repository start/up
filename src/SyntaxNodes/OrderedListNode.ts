import { concat } from '../CollectionHelpers'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { FootnoteNode } from './FootnoteNode'
import { Sequence } from '../Sequence'


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

  processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence: Sequence): FootnoteNode[] {
    return concat(
      this.items.map(item => item.processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence)))
  }

  OUTLINE_SYNTAX_NODE(): void { }
}


export module OrderedListNode {
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