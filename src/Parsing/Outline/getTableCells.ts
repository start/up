import { TableNode } from '../../SyntaxNodes/TableNode'
import { patternStartingWith, atLeastOne } from '../PatternHelpers'
import { getInlineNodes } from '../Inline/getInlineNodes'
import { UpConfig } from '../../UpConfig'
import { last } from '../../CollectionHelpers'
import { ESCAPER_CHAR } from '../Strings'


// `TableNode.Cell` is an abstract class extended by both`TableNode.Header.Cell` and
// `TableNode.Row.Cell`.
//
// `TableNode.Cell` gets exported with our library's module. Conceivably, it could be
// used for some sort of processing or analysis of the abstract syntax tree. However,
// Up library users should never need to instantiate objects of that class, so it would
// be misleading to export it as non-abstract.
//
// During parsing, however, we do need to create objects that can later be converted to
// eaither header cells or row cells. Hence this fun little class. 
export class TableCell extends TableNode.Cell { }


export function getTableCells(row: string, config: UpConfig): TableNode.Cell[] {
  // We trim the contents of each cell, which means trimming the whole row isn't strictly
  // necessary. However, doing so (or at least trimming the end of the strimg) makes it a
  // bit easier for us to tell when a row ends with a single unescaped semicolon.
  //
  // As a rule, if the last cell in the table isn't blank, and if it spans just a single
  // column, we add an extra empty cell to the end of the row.
  row = row.trim()

  const cells: TableCell[] = []
  let charIndexOfStartOfNextCell = 0
  let charIndex = 0

  function collectCell(args: { countColumnsSpanned: number }): void {
    const rawCellValue = row.slice(charIndexOfStartOfNextCell, charIndex)
    const cellChildren = getInlineNodes(rawCellValue.trim(), config)

    cells.push(new TableCell(cellChildren, args.countColumnsSpanned))
  }

  for (; charIndex < row.length; charIndex++) {
    const char = row[charIndex]

    if (char === ESCAPER_CHAR) {
      // Escaped delimiters don't delimit cells, so we can safely skip the next character.
      charIndex++
      continue
    }

    const result = DELIMITER_PATTERN.exec(row.slice(charIndex))

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
  // the rule described at the to of the mthod: If the last cell in the table isn't blank,
  // and if it spans just a single column, we have to add an extra empty cell to the end
  // of the row.

  const lastCell = last(cells)

  const shouldCollectAnotherCell =
    // If the last delimiter on the row wasn't at the end of the row...
    charIndexOfStartOfNextCell < row.length
    || (
      // ... or if the last cell isnt blank...
      //
      // Two notes:
      //
      // 1. We know `row` will never be empty, and we know the first cell always starts at
      //    the `0` index of `row`. Therefore, if `charIndexOfStartOfNextCell` is the row's
      //    length, we must have already found at least one cell (and thus `lastCell` won't
      //    be null).
      //
      // 2. Before we parse a cell for inline nodes, its content is trimmed. Therefore, to
      //    check whether a cell is blank, we can simply check whether it has no children.
      lastCell.children.length !== 0
      // ... and if the last cell spans just one column, then we should collect another
      // cell.
      && lastCell.countColumnsSpanned === 1)

  if (shouldCollectAnotherCell) {
    collectCell({ countColumnsSpanned: 1 })
  }

  return cells
}


const DELIMITER_PATTERN =
  patternStartingWith(atLeastOne(';'))
