import { last } from '../../CollectionHelpers'
import { NormalizedSettings } from '../../NormalizedSettings'
import { oneOrMore, patternStartingWith } from '../../PatternHelpers'
import { Table } from '../../SyntaxNodes/Table'
import { getInlineSyntaxNodes } from '../Inline/getInlineSyntaxNodes'
import { BACKSLASH } from '../Strings'


// `Table.Cell` is an abstract class extended by both`Table.Header.Cell` and
// `Table.Row.Cell`.
//
// `Table.Cell` gets exported with our library's module. Conceivably, it could be
// used for some sort of processing or analysis of the abstract syntax tree. However,
// Up library users should never need to instantiate objects of that class, so it would
// be misleading to export it as non-abstract.
//
// During parsing, however, we do need to create objects that can later be converted to
// either header cells or row cells. Hence this fun little class.
export class TableCell extends Table.Cell { }


export function getTableCells(row: string, settings: NormalizedSettings.Parsing): Table.Cell[] {
  // We trim the contents of each cell, which means trimming the whole row isn't strictly
  // necessary. However, doing so (or at least trimming the end of the string) makes it a
  // bit easier for us to tell when a row ends with a single unescaped semicolon.
  //
  // As a rule, if the last cell in a row spans just a single column (i.e. it ends in
  // a single unescaped semicolon), and if that last cell was not 0-length cell at the
  // start of the row (i.e. the row does not consist solely of a single semicolon), then
  // we add an extra empty cell to the end of the row.
  row = row.trim()

  const cells: TableCell[] = []
  let charIndexOfStartOfNextCell = 0
  let charIndex = 0

  function collectCell(args: { countColumnsSpanned: number }): void {
    const cellMarkup = row.slice(charIndexOfStartOfNextCell, charIndex)
    const cellChildren = getInlineSyntaxNodes(cellMarkup.trim(), settings)

    cells.push(new TableCell(cellChildren, args.countColumnsSpanned))
  }

  for (; charIndex < row.length; charIndex++) {
    const char = row[charIndex]

    if (char === BACKSLASH) {
      // Escaped semicolons don't delimit cells, so we can safely skip the next character.
      charIndex++
      continue
    }

    const result = CELL_DELIMITER_PATTERN.exec(row.slice(charIndex))

    if (!result) {
      // We aren't dealing with the end of a cell, so let's just continue the loop.
      continue
    }

    const [delimiter] = result

    collectCell({ countColumnsSpanned: delimiter.length })
    charIndexOfStartOfNextCell = charIndex + delimiter.length

    // `i` is going to be incremented again at the start of the next iteration
    charIndex += delimiter.length - 1
  }

  // In the loop above, cells are only collected after each delimiter.  We still need to
  // collect the row's final cell (the one after the last delimiter).
  //
  // Furthermore, even if the last delimiter was on the end of the row, we have to satisfy
  // the rule described at the top of the method: If the last cell in a row spans just a single
  // column (i.e. it ends in a single unescaped semicolon), and if that last cell was not a
  // 0-length cell at the start of the row (i.e. the row does not consist solely of a single
  // semicolon), then we add an extra empty cell to the end of the row.

  const lastCell = last(cells)!

  const shouldCollectOneLastCell =
    // If the last delimiter row wasn't at the end of the row...
    charIndexOfStartOfNextCell < row.length
    || (
      // ... or if the last cell spans just a single column...
      lastCell.countColumnsSpanned === 1
      // ... and row does not consist solely of a single semicolon, then we'll add an extra
      // cell to the end of the row.
      && row !== SEMICOLON)

  if (shouldCollectOneLastCell) {
    collectCell({ countColumnsSpanned: 1 })
  }

  return cells
}


const SEMICOLON = ';'

const CELL_DELIMITER_PATTERN =
  patternStartingWith(oneOrMore(SEMICOLON))
