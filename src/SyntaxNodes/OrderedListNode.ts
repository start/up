import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'
import { OrderedListItemNode } from '../SyntaxNodes/OrderedListItemNode'

export enum ListOrder {
  Ascending,
  Descrending
}

export class OrderedListNode extends RichSyntaxNode {
  start(): number {
    return this.listItems()[0].ordinal
  }

  order(): ListOrder {
    const withExplicitOrdinals =
      this.listItems().filter((listItem) => listItem.ordinal != null)

    if (withExplicitOrdinals.length < 2) {
      return ListOrder.Ascending
    }

    return (
      withExplicitOrdinals[0].ordinal > withExplicitOrdinals[1].ordinal
        ? ListOrder.Descrending
        : ListOrder.Ascending
    )
  }

  private listItems(): OrderedListItemNode[] {
    return <OrderedListItemNode[]>this.children
  }

  private NUMBERED_LIST: any = null
}