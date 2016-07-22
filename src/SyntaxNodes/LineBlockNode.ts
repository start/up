import { InlineSyntaxNode } from './InlineSyntaxNode'


export class LineBlockNode {
  OUTLINE_SYNTAX_NODE(): void { }

  constructor(public lines: LineBlockNode.Line[]) { }
}


export module LineBlockNode {
  export class Line {
    protected LINE_BLOCK_LINE: any = null

    constructor(public children: InlineSyntaxNode[]) { }
  }
}