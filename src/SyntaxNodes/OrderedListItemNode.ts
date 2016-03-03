import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'

export class OrderedListItemNode extends RichSyntaxNode {
  // During parsing, `ordinal` can be either `null` or a number. Defaulting `ordinal` to `null`
  // allows our unit tests to be cleaner.  
  constructor(parentOrChildren?: RichSyntaxNode | SyntaxNode[], public ordinal: number = null) {
    super(parentOrChildren)
  }
  
  private NUMBERED_LIST_ITEM: any = null
}