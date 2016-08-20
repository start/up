import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { Heading } from './Heading'
import { concat } from '../CollectionHelpers'


export class UnorderedList implements OutlineSyntaxNode {
  constructor(
    public items: UnorderedList.Item[],
    public sourceLineNumber: number = undefined) { }

  descendantHeadingsToIncludeInTableOfContents(): Heading[] {
    return concat(
      this.items.map(item => item.descendantHeadingsToIncludeInTableOfContents()))
  }
}


export namespace UnorderedList {
  export class Item extends OutlineSyntaxNodeContainer {
    protected UNORDERED_LIST_ITEM(): void { }
  }
}
