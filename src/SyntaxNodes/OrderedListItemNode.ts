import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'

export class OrderedListItemNode extends RichSyntaxNode {
  // During parsing, `ordinal` can be either `null` or a number. Defaulting `ordinal` to `null`
  // rather than `undefined` allows our unit tests to be cleaner.
  constructor(children?: SyntaxNode[], public ordinal: number = null) {
    super(children)
  }
  
  private ORDERED_LIST_ITEM: any = null
}