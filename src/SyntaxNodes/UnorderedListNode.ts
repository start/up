import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { concat } from '../CollectionHelpers'


export class UnorderedListNode implements OutlineSyntaxNode {
  constructor(public items: UnorderedListNode.Item[]) { }

  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  childrenToIncludeInTableOfContents(): OutlineSyntaxNode[] {
    return concat(
      this.items.map(item => item.childrenToIncludeInTableOfContents()))
  }
}


export namespace UnorderedListNode {
  export class Item extends OutlineSyntaxNodeContainer {
    protected UNORDERED_LIST_ITEM(): void { }
  }
}
