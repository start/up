import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { UpDocument } from './UpDocument'
import { concat } from '../CollectionHelpers'
import { Renderer } from '../Rendering/Renderer'


export class UnorderedList implements OutlineSyntaxNode {
  public sourceLineNumber: number = undefined

  constructor(
    public items: UnorderedList.Item[], options?: { sourceLineNumber: number }) {
    if (options) {
      this.sourceLineNumber = options.sourceLineNumber
    }
  }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return concat(
      this.items.map(item => item.descendantsToIncludeInTableOfContents()))
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return concat(
      this.items.map(item => item.inlineDescendants()))
  }

  render(renderer: Renderer): string {
    return renderer.unorderedList(this)
  }
}


export namespace UnorderedList {
  export class Item extends OutlineSyntaxNodeContainer {
    protected UNORDERED_LIST_ITEM(): void { }
  }
}
