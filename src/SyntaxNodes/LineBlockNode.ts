import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'


export class LineBlockNode implements OutlineSyntaxNode {
  constructor(public lines: LineBlockNode.Line[], public sourceLineNumber: number = undefined) { }

  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  descendantsToIncludeInTableOfContents(): OutlineSyntaxNode[] {
    return []
  }
}


export namespace LineBlockNode {
  export class Line extends InlineSyntaxNodeContainer {
    protected LINE_BLOCK_LINE(): void { }
  }
}
