import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { UpDocument } from './UpDocument'
import { concat } from '../CollectionHelpers'
import { Renderer } from '../Rendering/Renderer'


export class LineBlock implements OutlineSyntaxNode {
  public sourceLineNumber: number = undefined

  constructor(public lines: LineBlock.Line[], options?: { sourceLineNumber: number }) {
    if (options) {
      this.sourceLineNumber = options.sourceLineNumber
    }
  }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return []
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return concat(
      this.lines.map(line => line.inlineDescendants()))
  }

  render(renderer: Renderer): string {
    return renderer.lineBlock(this)
  }
}


export namespace LineBlock {
  export class Line extends InlineSyntaxNodeContainer {
    protected LINE_BLOCK_LINE(): void { }
  }
}
