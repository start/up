import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { UpDocument } from './UpDocument'
import { concat } from '../CollectionHelpers'


export class LineBlock implements OutlineSyntaxNode {
  constructor(public lines: LineBlock.Line[], public sourceLineNumber: number = undefined) { }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return []
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return concat(
      this.lines.map(line => line.inlineDescendants()))
  }
}


export namespace LineBlock {
  export class Line extends InlineSyntaxNodeContainer {
    protected LINE_BLOCK_LINE(): void { }
  }
}
