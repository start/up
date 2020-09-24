import { concat } from '../CollectionHelpers'
import { Renderer } from '../Rendering/Renderer'
import { Heading } from './Heading'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'


export class BulletedList implements OutlineSyntaxNode {
  sourceLineNumber?: number

  constructor(
    public items: BulletedList.Item[],
    options?: { sourceLineNumber: number }
  ) {
    this.sourceLineNumber = options?.sourceLineNumber
  }

  descendantsToIncludeInTableOfContents(): Heading[] {
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
    protected readonly BULLETED_LIST_ITEM = undefined
  }
}
