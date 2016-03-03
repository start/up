import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'
import { OrderedListItemNode } from '../SyntaxNodes/OrderedListItemNode'

export enum ListOrder {
  Ascending,
  Descrending
}

export class OrderedListNode extends RichSyntaxNode {
  constructor(parentOrChildren?: RichSyntaxNode | SyntaxNode[], public order = ListOrder.Ascending) {
    super(parentOrChildren)
  }
  
  start(): number {
    return (<OrderedListItemNode>this.children[0]).ordinal
  }

  private NUMBERED_LIST: any = null
}