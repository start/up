import { OutlineSyntaxNode } from '../SyntaxNodes/OutlineSyntaxNode'

export class OrderedListItem  {
  // During parsing, `ordinal` can be either `null` or a number. Defaulting `ordinal` to `null`
  // rather than `undefined` allows our unit tests to be cleaner.
  constructor(public children?: OutlineSyntaxNode[], public ordinal: number = null) { }
  
  private ORDERED_LIST_ITEM: any = null
}