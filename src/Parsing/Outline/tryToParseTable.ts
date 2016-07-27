import { LineConsumer } from './LineConsumer'
import { TableNode } from '../../SyntaxNodes/TableNode'
import { OutlineParserArgs } from './OutlineParserArgs'
import { outlineLabel } from '../PatternHelpers'
import { getInlineNodes } from '../Inline/getInlineNodes'
import { BLANK_PATTERN } from '../Patterns'
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

  const {config } = args
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

  const rawHeaderCells = getRawCellValues(headerLine)
  const rawCellsByRow: string[][] = []

  let countLinesConsumed: number

  do {
    countLinesConsumed = lineConsumer.countLinesConsumed
  } while (
    !tryToTerminateTable(lineConsumer)
    && lineConsumer.consume({
      then: line => {
        rawCellsByRow.push(getRawCellValues(line))
      }
    }))

  const getCellChildren = (cellContent: string) =>
    getInlineNodes(cellContent, config)

  const header = new TableNode.Header(
    rawHeaderCells
      .map(getCellChildren)
      .map(cellChildren => new TableNode.Header.Cell(cellChildren)))

  const rows = rawCellsByRow
    .map(rawCells =>
      new TableNode.Row(rawCells
        .map(getCellChildren)
        .map(cellChildren => new TableNode.Row.Cell(cellChildren))))

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

function getRawCellValues(line: string): string[] {
  const rawCellValues: string[] = []
  let nextCellStartIndex = 0

  function collectRawValueOfNextCell(args: { endingBefore: number }): void {
    rawCellValues.push(
      line.slice(nextCellStartIndex, args.endingBefore).trim())
  }

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    switch (char) {
      case ESCAPER_CHAR:
        // Escaped delimiters don't delimit cells, so we can safely skip over the next character.
        i++
        continue

      case ';':
        collectRawValueOfNextCell({ endingBefore: i })
        nextCellStartIndex = i + 1
        continue
    }
  }

  // Here, we need to add the last cell, even if the row ended in a semicolon.
  //
  // In fact, that's the rule! Ending a row with a non-escaped semicolon indicates that one last
  // blank cell should be added to the row.
  collectRawValueOfNextCell({ endingBefore: line.length })

  return rawCellValues
}