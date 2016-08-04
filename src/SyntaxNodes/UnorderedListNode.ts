import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'


export class UnorderedListNode implements OutlineSyntaxNode {
  constructor(public items: UnorderedListNode.Item[]) { }

  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }
}


export namespace UnorderedListNode {
  export class Item extends OutlineSyntaxNodeContainer {
    protected UNORDERED_LIST_ITEM(): void { }
  }
}
