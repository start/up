import { concat } from '../CollectionHelpers'
import { Renderer } from '../Rendering/Renderer'
import { Document } from './Document'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'


export class BulletedList implements OutlineSyntaxNode {
  sourceLineNumber: number | undefined = undefined

  constructor(
    public items: BulletedList.Item[], options?: { sourceLineNumber: number }) {
    if (options) {
      this.sourceLineNumber = options.sourceLineNumber
    }
  }

  descendantsToIncludeInTableOfContents(): Document.TableOfContents.Entry[] {
    return concat(
      this.items.map(item => item.descendantsToIncludeInTableOfContents()))
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return concat(
      this.items.map(item => item.inlineDescendants()))
  }

  render(renderer: Renderer): string {
    return renderer.bulletedList(this)
  }
}


export namespace BulletedList {
  export class Item extends OutlineSyntaxNodeContainer {
    protected BULLETED_LIST_ITEM(): void { }
  }
}
