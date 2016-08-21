import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { UpDocument } from './UpDocument'
import { concat } from '../CollectionHelpers'


export class UnorderedList implements OutlineSyntaxNode {
  constructor(
    public items: UnorderedList.Item[],
    public sourceLineNumber: number = undefined) { }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return concat(
      this.items.map(item => item.descendantsToIncludeInTableOfContents()))
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return concat(
      this.items.map(item => item.inlineDescendants()))
  }
}


export namespace UnorderedList {
  export class Item extends OutlineSyntaxNodeContainer {
    protected UNORDERED_LIST_ITEM(): void { }
  }
}
