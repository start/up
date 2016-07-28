import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { InlineSyntaxNode } from './InlineSyntaxNode'


export class TableNode implements OutlineSyntaxNode {
  constructor(public header: TableNode.Header, public rows: TableNode.Row[]) { }

  OUTLINE_SYNTAX_NODE(): void { }
}


export namespace TableNode {
  export abstract class Cell extends InlineSyntaxNodeContainer {
    constructor(children: InlineSyntaxNode[], public countColumnsSpanned = 1) {
      super(children)
    }
  }


  export class Header {
    constructor(public cells: Header.Cell[]) { }
  }

  export namespace Header {
    export class Cell extends TableNode.Cell {
      protected TABLE_HEADER_CELL(): void { }
    }
  }


  export class Row {
    constructor(public cells: Row.Cell[]) { }
  }

  export namespace Row {
    export class Cell extends TableNode.Cell {
      isContentNumeric(): boolean {
        return false
      }

      protected TABLE_ROW_CELL(): void { }
    }
  }
}
