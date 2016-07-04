import { OrderedListItem } from '../SyntaxNodes/OrderedListItem'


export class OrderedListNode {
  OUTLINE_SYNTAX_NODE(): void { }
  
  constructor(public listItems: OrderedListItem[] = []) { }

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

