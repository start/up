import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Document } from './Document'
import { WHITESPACE_CHAR, LETTER_CLASS, DIGIT } from '../PatternPieces'
import { anyCharMatching } from '../PatternHelpers'
import { concat } from '../CollectionHelpers'
import { getInlineDescendants } from './getInlineDescendants'
import { Renderer } from '../Rendering/Renderer'


export class Table implements OutlineSyntaxNode {
  sourceLineNumber: number | undefined = undefined

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

  descendantsToIncludeInTableOfContents(): Document.TableOfContents.Entry[] {
    return []
  }

  inlineDescendants(): InlineSyntaxNode[] {
    const captionAndCells = concat([
      this.caption ? [this.caption] : [] as InlineSyntaxNodeContainer[],
      this.header.cells,
      ...this.rows.map(row => row.allCellsStartingWithHeaderColumnCell)
    ])

    return concat(
      captionAndCells.map(captionOrCell => getInlineDescendants(captionOrCell.children)))
  }

  render(renderer: Renderer): string {
    return renderer.table(this)
  }
}


export namespace Table {
  export class Caption extends InlineSyntaxNodeContainer {
    protected TABLE_CAPTION(): void { }
  }


  export abstract class Cell extends InlineSyntaxNodeContainer {
    constructor(children: InlineSyntaxNode[], public countColumnsSpanned = 1) {
      super(children)
    }

    isNumeric(): boolean {
      const textContent = this.children
        .map(child => child.textAppearingInline())
        .join('')

      return CONTAINS_DIGIT.test(textContent) && !CONTAINS_NON_NUMERIC_CHARACTER.test(textContent)
    }
  }

  const CONTAINS_DIGIT = new RegExp(DIGIT)

  const CONTAINS_NON_NUMERIC_CHARACTER = new RegExp(
    anyCharMatching(LETTER_CLASS, '_', WHITESPACE_CHAR))


  export class Header {
    constructor(public cells: Header.Cell[]) { }
  }

  export namespace Header {
    export class Cell extends Table.Cell {
      protected TABLE_HEADER_CELL(): void { }
    }
  }


  export class Row {
    constructor(public cells: Row.Cell[], public headerColumnCell?: Header.Cell) { }

    get allCellsStartingWithHeaderColumnCell(): Table.Cell[] {
      const allCells: Table.Cell[] = this.cells.slice()

      if (this.headerColumnCell) {
        allCells.unshift(this.headerColumnCell)
      }

      return allCells
    }
  }

  export namespace Row {
    export class Cell extends Table.Cell {
      protected TABLE_ROW_CELL(): void { }
    }
  }
}
