import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'


export class LineBlockNode implements OutlineSyntaxNode {
  constructor(public lines: LineBlockNode.Line[]) { }

  OUTLINE_SYNTAX_NODE(): void { }
}


export namespace LineBlockNode {
  export class Line extends InlineSyntaxNodeContainer {
    protected LINE_BLOCK_LINE(): void { }
  }
}
