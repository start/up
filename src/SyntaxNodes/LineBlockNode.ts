import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'


export class LineBlockNode implements OutlineSyntaxNode {
  constructor(public lines: LineBlockNode.Line[]) { }

  OUTLINE_SYNTAX_NODE(): void { }
}


export module LineBlockNode {
  export class Line implements InlineSyntaxNodeContainer {
    constructor(public children: InlineSyntaxNode[]) { }

    protected LINE_BLOCK_LINE(): void { }
  }
}