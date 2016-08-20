import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { Heading } from './Heading'


export class LineBlock implements OutlineSyntaxNode {
  constructor(public lines: LineBlock.Line[], public sourceLineNumber: number = undefined) { }

  descendantHeadingsToIncludeInTableOfContents(): Heading[] {
    return []
  }
}


export namespace LineBlock {
  export class Line extends InlineSyntaxNodeContainer {
    protected LINE_BLOCK_LINE(): void { }
  }
}
