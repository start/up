import { OrderedListItem } from '../SyntaxNodes/OrderedListItem'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class OrderedListNode extends OutlineSyntaxNode {
  constructor(public listItems: OrderedListItem[] = []) {
    super()
  }
  
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

  private ORDERED_LIST: any = null
}

export enum OrderedListOrder {
  Ascending,
  Descrending
}

