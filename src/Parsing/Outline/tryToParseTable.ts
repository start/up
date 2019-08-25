import { capture, either, escapeForRegex, optional, solelyAndIgnoringCapitalization } from '../../PatternHelpers'
import { REST_OF_TEXT } from '../../PatternPieces'
import { BLANK_PATTERN, INDENTED_PATTERN, NON_BLANK_PATTERN } from '../../Patterns'
import { Table } from '../../SyntaxNodes/Table'
import { getInlineSyntaxNodes } from '../Inline/getInlineSyntaxNodes'
import { getTableCells } from './getTableCells'
import { LineConsumer } from './LineConsumer'
import { OutlineParserArgs } from './OutlineParserArgs'


// Tables start with a "label line". The label line consists of the configurable
// keyword for "table", followed by an optional colon, followed by an optional
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
// If a table's header row is indented, it indicates the table should also have a
// header column in addition to its header row. For example:
//
// Table: `AND` operator logic
//
//         1;      0
// 1;      true;   false
// 0;      false;  false
//
// Specifically, when the header row is indented:
//
// 1. The first cell of each row in the table is treated as a header for that row.
// 2. An empty cell is automatically added to the beginning of the table's header
//    row (the top left corner, above the header column).

export function tryToParseTable(args: OutlineParserArgs): boolean {
  const markupLineConsumer = new LineConsumer(args.markupLines)

  const { settings } = args

  const labelPattern = solelyAndIgnoringCapitalization(
    either(...settings.keywords.table.map(escapeForRegex)) + optional(':' + capture(REST_OF_TEXT)))

  const labelLineResult =
    markupLineConsumer.consumeLineIfMatches(labelPattern)

  if (!labelLineResult) {
    return false
  }

  const [captionPart] = labelLineResult.captures

  const captionMarkup = captionPart
    ? captionPart.trim()
    : ''

  // We have our label line (with an optional caption).
  //
  // Let's consume the optional blank line before the header row.
  markupLineConsumer.consumeLineIfMatches(BLANK_PATTERN)

  const headerRowResult =
    markupLineConsumer.consumeLineIfMatches(NON_BLANK_PATTERN)

  if (!headerRowResult) {
    return false
  }

  // As a rule, if a table's header row is indented, it indicates the table should
  // also have a header column (in addition to its header row).
  const alsoHasHeaderColumn = INDENTED_PATTERN.test(headerRowResult.line)
  const headerCells = getTableCells(headerRowResult.line, settings).map(toHeaderCell)

  // Okay! Now that we've found a label line (with an optional caption) and have a header,
  // we know we're dealing with a table.

  if (alsoHasHeaderColumn) {
    // When a table has a header column, we add an extra empty cell to the beginning of its
    // header row (above the header column).
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
      ? new Table.Caption(getInlineSyntaxNodes(captionMarkup, settings))
      : undefined

  const rows: Table.Row[] = []

  // Any trailing blank lines after the table are not consumed, and we don't know whether
  // the table will have any rows. Therefore, until we find our first row, we'll assume
  // the table ends here.
  let countLinesConsumed = markupLineConsumer.countLinesConsumed

  // Let's consume the optional blank line after the header row.
  markupLineConsumer.consumeLineIfMatches(BLANK_PATTERN)

  // Phew! We're finally ready to start consuming any rows!
  while (true) {
    const tableRowResult =
      markupLineConsumer.consumeLineIfMatches(NON_BLANK_PATTERN)

    if (!tableRowResult) {
      break
    }

    const cells = getTableCells(tableRowResult.line, settings)

    const headerColumnCell =
      alsoHasHeaderColumn
        ? toHeaderCell(cells.shift() as Table.Cell)
        : undefined

    rows.push(new Table.Row(cells.map(toRowCell), headerColumnCell))
    countLinesConsumed = markupLineConsumer.countLinesConsumed
  }

  args.then(
    [new Table(header, rows, caption)],
    countLinesConsumed)

  return true
}


const toHeaderCell = (cell: Table.Cell) =>
  new Table.Header.Cell(cell.children, cell.countColumnsSpanned)

const toRowCell = (cell: Table.Cell) =>
  new Table.Row.Cell(cell.children, cell.countColumnsSpanned)
