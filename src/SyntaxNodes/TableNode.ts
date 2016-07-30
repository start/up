import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { WHITESPACE_CHAR, LETTER_CLASS, DIGIT } from '../Parsing/PatternPieces'
import { anyCharMatching } from '../Parsing/PatternHelpers'


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
      isNumeric(): boolean {
        const textContent = this.children
          .map(child => child.text())
          .join('')

        return HAS_DIGIT_PATTERN.test(textContent) && !HAS_NON_NUMERIC_CHARACTER_PATTERN.test(textContent)
      }

      protected TABLE_ROW_CELL(): void { }
    }


    const HAS_DIGIT_PATTERN = new RegExp(DIGIT)
    
    const HAS_NON_NUMERIC_CHARACTER_PATTERN = new RegExp(
      anyCharMatching(LETTER_CLASS, '_', WHITESPACE_CHAR))
  }
}
