import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'

export enum ListOrder {
  Ascending,
  Descrending
}

export class OrderedListNode extends RichSyntaxNode {
  constructor(
    parentOrChildren?: RichSyntaxNode | SyntaxNode[],
    public order = ListOrder.Ascending,
    public start = 1
  ) {
    super(parentOrChildren)
  }

  private NUMBERED_LIST: any = null
}