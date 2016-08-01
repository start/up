import { LineConsumer } from './LineConsumer'
import { TableNode } from '../../SyntaxNodes/TableNode'
import { OutlineParserArgs } from './OutlineParserArgs'
import { solelyAndIgnoringCapitalization, escapeForRegex, optional, capture } from '../PatternHelpers'
import { BLANK_PATTERN } from '../Patterns'
import { REST_OF_TEXT } from '../PatternPieces'
import { getInlineNodes } from '../Inline/getInlineNodes'
import { getTableCells } from './getTableCells'


// Tables start with a "label line". The label line consists of the configurable
// term for "table", followed by an optional colon, followed by an optional
// caption. The caption can contain inline conventions.
//
// Next, there's the header, which is a line of semicolon-delimited cells.
//
// Finally, there's the collection of rows. Like the header, each row is a line of
// semicolon-delimited cells.
//
// If a header cell or table cell is ended by multiple semicolons, it spans that
// many columns.
//
// A table must have a header, but it doesn't need to have any rows.
//
// Within a table, single blank lines are allowed. However, two consecutive blank
// lines terminates the table. Any trailing blank lines after the table are not
// consumed.
//
// Here's an example table. The whitespace used for padding is optional and gets
// trimmed away:
//
//
// Table: Video games
//
// Game;               Developer;            Publisher;        Release Date
//
// Chrono Trigger;     Square;;                                March 11, 1995
// Terranigma;         Quintet;              Nintendo;         October 20, 1995
//
// Command & Conquer;  Westwood Studios;;                      August 31, 1995
// Starcraft;          Blizzard;;                              March 31, 1998
//
//
//
// Charts are tables with a second, vertical header. The only differences are:
//
// 1. Charts use the configurable term for "chart" instead of "table"
// 2. An empty cell is automatically added to the beginning of the chart's header
//    row (the top left corner) due to the header column beneath it 
// 3. The first cell of each row in a chart is treated as a header for that row.
//
// Here's an example chart:
//
//
// Chart: `AND` operator logic
//
//         1;      0
// 0;      true;   false
// 1;      false;  false
export function tryToParseTableOrChart(args: OutlineParserArgs): boolean {
  const lineConsumer = new LineConsumer(args.lines)

  const { config } = args
  const { terms } = config.settings.i18n

  const getLabelPattern = (term: string) =>
    solelyAndIgnoringCapitalization(
      escapeForRegex(term) + optional(':' + capture(REST_OF_TEXT)))

  let rawCaptionContent: string

  const setRawCaptionContent = (_: string, caption: string): void => {
    rawCaptionContent = (caption || '').trim()
  }

  const isTable =
    lineConsumer.consume({
      linePattern: getLabelPattern(terms.table),
      then: setRawCaptionContent
    })

  const isChart =
    !isTable && lineConsumer.consume({
      linePattern: getLabelPattern(terms.chart),
      then: setRawCaptionContent
    })

  if (!isTable && !isChart) {
    return false
  }

  let headerCells: TableNode.Header.Cell[]

  const hasHeader =
    !tryToTerminateTable(lineConsumer)
    && lineConsumer.consume({
      then: line => {
        headerCells = getTableCells(line, config).map(toHeaderCell)
      }
    })

  if (!hasHeader) {
    return false
  }

  // Okay! Now that we've found a label line (with an optional caption) and have a header,
  // we know we're dealing with a table/chart.

  if (isChart) {
    // Charts have an extra empty cell added to the beginning of their header row due
    // to the header column beneath it
    headerCells.unshift(new TableNode.Header.Cell([]))
  }

  const header = new TableNode.Header(headerCells)

  // Let's evaluate our caption for inline conventions. We could have done this before we
  // found header, but we'd have to throw away our work if:
  //
  // * The header was missing
  // * The label line (with the caption) was followed by 2 or more blank lines  
  const caption =
    rawCaptionContent
      ? new TableNode.Caption(getInlineNodes(rawCaptionContent, config))
      : undefined

  const rowCellsByRow: TableNode.Row.Cell[][] = []
  let countLinesConsumed: number

  do {
    countLinesConsumed = lineConsumer.countLinesConsumed
  } while (
    !tryToTerminateTable(lineConsumer)
    && lineConsumer.consume({
      then: line => {
        const rowCells =
          getTableCells(line, config).map(toRowCell)

        rowCellsByRow.push(rowCells)
      }
    }))

  const rows = rowCellsByRow.map(cells => new TableNode.Row(cells))

  args.then([new TableNode(header, rows, caption)], countLinesConsumed)
  return true
}


// Returns true if it's able to consume 2 blank lines.
//
// Note: If there was just 1 blank line, this function will still consume it.
function tryToTerminateTable(lineConsumer: LineConsumer): boolean {
  function consumeBlankLine(): boolean {
    return lineConsumer.consume({ linePattern: BLANK_PATTERN })
  }

  return consumeBlankLine() && consumeBlankLine()
}


const toHeaderCell = (cell: TableNode.Cell) =>
  new TableNode.Header.Cell(cell.children, cell.countColumnsSpanned)

const toRowCell = (cell: TableNode.Cell) =>
  new TableNode.Row.Cell(cell.children, cell.countColumnsSpanned)
