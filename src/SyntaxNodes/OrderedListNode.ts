import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { OrderedListItemNode } from '../SyntaxNodes/OrderedListItemNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'

export enum ListOrder {
  Ascending,
  Descrending
}

export class OrderedListNode extends OutlineSyntaxNode {
  constructor(public children: OrderedListItemNode[] = []) {
    super()
  }
  
  start(): number {
    return this.children[0].ordinal
  }

  order(): ListOrder {
    const withExplicitOrdinals =
      this.children.filter((listItem) => listItem.ordinal != null)

    if (withExplicitOrdinals.length < 2) {
      return ListOrder.Ascending
    }

    return (
      withExplicitOrdinals[0].ordinal > withExplicitOrdinals[1].ordinal
        ? ListOrder.Descrending
        : ListOrder.Ascending
    )
  }

  private ORDERED_LIST: any = null
}