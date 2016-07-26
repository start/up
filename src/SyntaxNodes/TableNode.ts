import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'


export class TableNode implements OutlineSyntaxNode {
  constructor(public header: TableNode.Header, public rows: TableNode.Row[]) { }

  OUTLINE_SYNTAX_NODE(): void { }
}


export namespace TableNode {
  export class Header {
    constructor(public cells: Header.Cell[]) { }

    protected TABLE_HEADER(): void { }
  }

  export namespace Header {
    export class Cell extends InlineSyntaxNodeContainer {
      protected TABLE_HEADER_CELL(): void { }
    }
  }


  export class Row {
    constructor(public cells: Row.Cell[]) { }

    protected TABLE_ROW(): void { }
  }

  export namespace Row {
    export class Cell extends InlineSyntaxNodeContainer {
      isContentNumeric(): boolean {
        return false
      }

      protected TABLE_ROW_CELL(): void { }
    }
  }
}
