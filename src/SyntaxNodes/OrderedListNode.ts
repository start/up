import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'

export enum Order {
  Ascending,
  Descrending
}

export class OrderedListNode extends RichSyntaxNode {
  constructor(
    parentOrChildren?: RichSyntaxNode | SyntaxNode[],
    public order = Order.Ascending,
    public start = 1
  ) {
    super(parentOrChildren)
  }

  private NUMBERED_LIST: any = null
}