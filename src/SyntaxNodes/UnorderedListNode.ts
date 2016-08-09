import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { concat } from '../CollectionHelpers'


export class UnorderedListNode implements OutlineSyntaxNode {
  constructor(public items: UnorderedListNode.Item[], public sourceLineNumber: number = undefined) { }

  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  descendantsToIncludeInTableOfContents(): OutlineSyntaxNode[] {
    return concat(
      this.items.map(item => item.descendantsToIncludeInTableOfContents()))
  }
}


export namespace UnorderedListNode {
  export class Item extends OutlineSyntaxNodeContainer {
    protected UNORDERED_LIST_ITEM(): void { }
  }
}
