import { concat } from '../CollectionHelpers'
import { anyCharMatching } from '../PatternHelpers'
import { DIGIT, LETTER_CLASS, WHITESPACE_CHAR } from '../PatternPieces'
import { Renderer } from '../Rendering/Renderer'
import { Heading } from './Heading'
import { getInlineDescendants } from './getInlineDescendants'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class Table implements OutlineSyntaxNode {
  sourceLineNumber?: number

  constructor(
    public header: Table.Header,
    public rows: Table.Row[],
    public caption?: Table.Caption,
    options?: { sourceLineNumber: number }
  ) {
    this.sourceLineNumber = options?.sourceLineNumber
  }

  descendantsToIncludeInTableOfContents(): Heading[] {
    return []
  }

  inlineDescendants(): InlineSyntaxNode[] {
    const captionAndCells = concat([
      this.caption ? [this.caption] : [] as InlineSyntaxNodeContainer[],
      this.header.cells,
      ...this.rows.map(row => row.allCellsStartingWithHeaderColumnCell())
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
    protected readonly TABLE_CAPTION = undefined
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

  // TODO: Doesn't work for non-English
  // Todo: Use u flag
  const CONTAINS_NON_NUMERIC_CHARACTER = new RegExp(
    anyCharMatching(LETTER_CLASS, '_', WHITESPACE_CHAR))


  export class Header {
    constructor(public cells: Header.Cell[]) { }
  }

  export namespace Header {
    export class Cell extends Table.Cell {
      protected readonly TABLE_HEADER_CELL = undefined
    }
  }


  export class Row {
    constructor(public cells: Row.Cell[], public headerColumnCell?: Header.Cell) { }

    allCellsStartingWithHeaderColumnCell(): Table.Cell[] {
      const allCells: Table.Cell[] = this.cells.slice()

      if (this.headerColumnCell) {
        allCells.unshift(this.headerColumnCell)
      }

      return allCells
    }
  }

  export namespace Row {
    export class Cell extends Table.Cell {
      protected readonly TABLE_ROW_CELL = undefined
    }
  }
}
