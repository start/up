import { LineConsumer } from './LineConsumer'
import { TableNode } from '../../SyntaxNodes/TableNode'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { OutlineParserArgs } from './OutlineParserArgs'
import { outlineLabel, patternStartingWith, atLeast } from '../PatternHelpers'
import { getInlineNodes } from '../Inline/getInlineNodes'
import { BLANK_PATTERN } from '../Patterns'
import { UpConfig } from '../../UpConfig'
import { last } from '../../CollectionHelpers'
import { ESCAPER_CHAR } from '../Strings'


// Tables start with a line consisting solely of "Table:". The term for "table" is
// configurable.
//
// Next, there's the header. The header is a line of semicolon-delimited values.
//
// Finally, there's the collection of rows. Like the header, each row is a line of
// semicolon-delimited values.
//
// Within a table, single blank lines are allowed. However, two consecutive blank
// lines terminates the table. Any trailing blank lines after the table are not
// consumed.
//
// A table must have a header, but it doesn't need to have any rows.
export function tryToParseTable(args: OutlineParserArgs): boolean {
  const lineConsumer = new LineConsumer(args.lines)

  const { config } = args
  const tableTerm = config.settings.i18n.terms.table

  let headerLine: string

  const isHeader = (
    lineConsumer.consume({ linePattern: outlineLabel(tableTerm) })

    && !tryToTerminateTable(lineConsumer)

    && lineConsumer.consume({
      then: line => {
        headerLine = line
      }
    }))

  if (!isHeader) {
    return false
  }

  const headerCells = getCells(TableNode.Header.Cell, headerLine, config)
  const header = new TableNode.Header(headerCells)

  const rowCellsByRow: TableNode.Row.Cell[][] = []
  let countLinesConsumed: number

  do {
    countLinesConsumed = lineConsumer.countLinesConsumed
  } while (
    !tryToTerminateTable(lineConsumer)
    && lineConsumer.consume({
      then: line => {
        rowCellsByRow.push(getCells(TableNode.Row.Cell, line, config))
      }
    }))

  const rows = rowCellsByRow.map(cells => new TableNode.Row(cells))

  args.then([new TableNode(header, rows)], countLinesConsumed)
  return true
}


// Returns true if it's able to consume 2 blank lines.
//
// Note: If there was just 1 blank line, this function will consume it.
function tryToTerminateTable(lineConsumer: LineConsumer): boolean {
  function consumeBlankLine(): boolean {
    return lineConsumer.consume({ linePattern: BLANK_PATTERN })
  }

  return consumeBlankLine() && consumeBlankLine()
}

function getCells<TCell extends TableNode.Cell>(
  CellType: new (children: InlineSyntaxNode[], countColumnsSpanned: number) => TCell,
  row: string,
  config: UpConfig
): TCell[] {
  // We trim the contents of each cell, which means trimming the whole row isn't strictly
  // necessary. However, doing so (or at least trimming the end of the strimg) makes it a
  // bit easier for us to tell when a row ends with a single unescaped semicolon.
  //
  // As a rule, if the last cell in the table isn't blank, and if it spans just a single
  // column, we add an extra empty cell to the end of the row.
  row = row.trim()

  const cells: TCell[] = []
  let charIndexOfStartOfNextCell = 0
  let charIndex = 0

  function collectCell(args: { countColumnsSpanned: number }): void {
    const rawCellValue = row.slice(charIndexOfStartOfNextCell, charIndex)
    const cellChildren = getInlineNodes(rawCellValue.trim(), config)

    cells.push(new CellType(cellChildren, args.countColumnsSpanned))
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
  patternStartingWith(atLeast(1, ';'))