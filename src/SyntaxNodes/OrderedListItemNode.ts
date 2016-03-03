import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'

export class OrderedListItemNode extends RichSyntaxNode {
  constructor(parentOrChildren?: RichSyntaxNode | SyntaxNode[], public ordinal?: number) {
    super(parentOrChildren)
  }
  
  private NUMBERED_LIST_ITEM: any = null
}