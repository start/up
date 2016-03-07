import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { OutlineSyntaxNode } from '../SyntaxNodes/OutlineSyntaxNode'

export class OrderedListItemNode extends SyntaxNode {
  // During parsing, `ordinal` can be either `null` or a number. Defaulting `ordinal` to `null`
  // rather than `undefined` allows our unit tests to be cleaner.
  constructor(public children?: OutlineSyntaxNode[], public ordinal: number = null) {
    super()
  }
  
  private ORDERED_LIST_ITEM: any = null
}