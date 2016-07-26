import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'


export class TableNode implements OutlineSyntaxNode {
  constructor(public header: TableNode.Header, public rows: TableNode.Row[]) { }

  OUTLINE_SYNTAX_NODE(): void { }
}


export namespace TableNode {
  export class Header {
    constructor(public cells: Cell[]) { }

    protected TABLE_HEADER(): void { }
  }

  export class Row {
    constructor(public cells: Cell[]) { }

    protected TABLE_ROW(): void { }
  }

  export class Cell extends InlineSyntaxNodeContainer {
    protected TABLE_CELL(): void { }
  }
}
