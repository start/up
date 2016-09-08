import { LineConsumer } from './LineConsumer'
import { Table } from '../../SyntaxNodes/Table'
import { OutlineParserArgs } from './OutlineParserArgs'
import { solelyAndIgnoringCapitalization, escapeForRegex, optional, either, capture } from '../../PatternHelpers'
import { BLANK_PATTERN, NON_BLANK_PATTERN } from '../../Patterns'
import { REST_OF_TEXT } from '../../PatternPieces'
import { getInlineSyntaxNodes } from '../Inline/getInlineSyntaxNodes'
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
// Single blank lines are before and after the table's header, but a table rows
// must all be consecutive.
//
// Any trailing blank lines after the table are not consumed.
//
// Here's an example table. The whitespace used for padding between cells is
// optional and gets trimmed away:
//
// Table: Video games
//
// Game;               Developer;            Publisher;        Release Date
//
// Chrono Trigger;     Square;;                                March 11, 1995
// Terranigma;         Quintet;              Nintendo;         October 20, 1995
// Command & Conquer;  Westwood Studios;;                      August 31, 1995
// Starcraft;          Blizzard;;                              March 31, 1998
//
//
// Charts are tables with a second, vertical header. The only differences are:
//
// 1. Charts use the configurable term for "chart" instead of "table".
// 2. The first cell of each row in a chart is treated as a header for that row.
// 3. An empty cell is automatically added to the beginning of the chart's header
//    row (the top left corner) due to the header column beneath it.
//
// Here's an example chart:
//
// Chart: `AND` operator logic
//
//         1;      0
// 1;      true;   false
// 0;      false;  false
export function tryToParseTableOrChart(args: OutlineParserArgs): boolean {
  const markupLineConsumer = new LineConsumer(args.markupLines)

  const { config } = args

  const getLabelPattern = (labels: string[]) =>
    solelyAndIgnoringCapitalization(
      either(...labels.map(escapeForRegex)) + optional(':' + capture(REST_OF_TEXT)))

  let captionMarkup: string

  function setRawCaptionMarkup(_: string, caption: string): void {
    captionMarkup = (caption || '').trim()
  }

  const isTable =
    markupLineConsumer.consume({
      linePattern: getLabelPattern(config.terms.markup.table),
      thenBeforeConsumingLine: setRawCaptionMarkup
    })

  const isChart =
    !isTable && markupLineConsumer.consume({
      linePattern: getLabelPattern(config.terms.markup.chart),
      thenBeforeConsumingLine: setRawCaptionMarkup
    })

  if (!isTable && !isChart) {
    return false
  }

  // We have our label line (with an optional caption).
  //
  // Let's consume the optional blank line before the header row. 
  consumeBlankLine(markupLineConsumer)

  let headerCells: Table.Header.Cell[]

  const hasHeader =
    markupLineConsumer.consume({
      linePattern: NON_BLANK_PATTERN,
      thenBeforeConsumingLine: line => {
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
    headerCells.unshift(new Table.Header.Cell([]))
  }

  const header = new Table.Header(headerCells)

  // Let's evaluate our caption for inline conventions. We could have done this before we
  // found header, but we'd have to throw away our work if:
  //
  // * The header was missing
  // * The label line (with the caption) was followed by 2 or more blank lines  
  const caption =
    captionMarkup
      ? new Table.Caption(getInlineSyntaxNodes(captionMarkup, config))
      : undefined

  const rows: Table.Row[] = []

  // Any trailing blank lines after the table are not consumed, and we don't know whether
  // the table will have any rows. Therefore, until we find our first row, we'll assume
  // the table ends here.
  let countLinesConsumed = markupLineConsumer.countLinesConsumed

  // Let's consume the optional blank line after the header row. 
  consumeBlankLine(markupLineConsumer)

  // Phew! We're finally ready to start consuming any rows!
  while (
    markupLineConsumer.consume({
      linePattern: NON_BLANK_PATTERN,
      thenBeforeConsumingLine: line => {
        const cells = getTableCells(line, config)

        // In a chart, the first cell of each row is treated as a header for that row.
        const rowHeaderCell =
          isChart
            ? toHeaderCell(cells.shift())
            : undefined

        rows.push(new Table.Row(cells.map(toRowCell), rowHeaderCell))
      }
    })
  ) {
    countLinesConsumed = markupLineConsumer.countLinesConsumed
  }

  args.then(
    [new Table(header, rows, caption)],
    countLinesConsumed)

  return true
}


function consumeBlankLine(markupLineConsumer: LineConsumer): boolean {
  return markupLineConsumer.consume({ linePattern: BLANK_PATTERN })
}

const toHeaderCell = (cell: Table.Cell) =>
  new Table.Header.Cell(cell.children, cell.countColumnsSpanned)

const toRowCell = (cell: Table.Cell) =>
  new Table.Row.Cell(cell.children, cell.countColumnsSpanned)
