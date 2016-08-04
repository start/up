import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { WHITESPACE_CHAR, LETTER_CLASS, DIGIT } from '../Parsing/PatternPieces'
import { anyCharMatching } from '../Parsing/PatternHelpers'


export class TableNode implements OutlineSyntaxNode {
  constructor(
    public header: TableNode.Header,
    public rows: TableNode.Row[],
    public caption?: TableNode.Caption) { }

  shouldBeIncludedInTableOfContents(): boolean {
    return this.caption != null
  }
  
  childrenToIncludeInTableOfContents(): OutlineSyntaxNode[] {
    return []
  }
}


export namespace TableNode {
  export class Caption extends InlineSyntaxNodeContainer {
    protected TABLE_CAPTION(): void { }
  }


  export abstract class Cell extends InlineSyntaxNodeContainer {
    constructor(
      children: InlineSyntaxNode[],
      public countColumnsSpanned = 1
    ) {
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
    constructor(public cells: Row.Cell[], public headerCell?: Header.Cell) { }

    get cellsStartingWithRowHeaderCell(): TableNode.Cell[] {
      const allCells: TableNode.Cell[] = this.cells.slice()

      if (this.headerCell) {
        allCells.unshift(this.headerCell)
      }

      return allCells
    }
  }

  export namespace Row {
    export class Cell extends TableNode.Cell {
      isNumeric(): boolean {
        const textContent = this.children
          .map(child => child.inlineTextContent())
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
