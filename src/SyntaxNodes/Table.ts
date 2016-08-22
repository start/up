import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { UpDocument } from './UpDocument'
import { WHITESPACE_CHAR, LETTER_CLASS, DIGIT } from '../Parsing/PatternPieces'
import { anyCharMatching } from '../Parsing/PatternHelpers'
import { concat } from '../CollectionHelpers'
import { getInlineDescendants } from './getInlineDescendants'


export class Table implements OutlineSyntaxNode {
  public sourceLineNumber: number = undefined

  constructor(
    public header: Table.Header,
    public rows: Table.Row[],
    public caption?: Table.Caption,
    options?: { sourceLineNumber: number }
  ) {
    if (options) {
      this.sourceLineNumber = options.sourceLineNumber
    }
  }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return []
  }

  inlineDescendants(): InlineSyntaxNode[] {
    const captionAndCells = concat<InlineSyntaxNodeContainer>([
      this.caption ? [this.caption] : [],
      this.header.cells,
      ...this.rows.map(row => row.allCellsStartingWithRowHeaderCell)
    ])

    return concat(
      captionAndCells.map(captionOrCell => getInlineDescendants(captionOrCell.children)))
  }
}


export namespace Table {
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
    export class Cell extends Table.Cell {
      protected TABLE_HEADER_CELL(): void { }
    }
  }


  export class Row {
    constructor(public cells: Row.Cell[], public headerCell?: Header.Cell) { }

    get allCellsStartingWithRowHeaderCell(): Table.Cell[] {
      const allCells: Table.Cell[] = this.cells.slice()

      if (this.headerCell) {
        allCells.unshift(this.headerCell)
      }

      return allCells
    }
  }

  export namespace Row {
    export class Cell extends Table.Cell {
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
