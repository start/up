import { concat } from '../CollectionHelpers'
import { Renderer } from '../Rendering/Renderer'
import { Heading } from './Heading'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class LineBlock implements OutlineSyntaxNode {
  sourceLineNumber: number | undefined = undefined

  constructor(public lines: LineBlock.Line[], options?: { sourceLineNumber: number }) {
    if (options) {
      this.sourceLineNumber = options.sourceLineNumber
    }
  }

  descendantsToIncludeInTableOfContents(): Heading[] {
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
