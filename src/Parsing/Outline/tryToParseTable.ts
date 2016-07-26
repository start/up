import { LineConsumer } from './LineConsumer'
// import { TableNode } from '../../SyntaxNodes/TableNode'
import { OutlineParserArgs } from './OutlineParserArgs'
import { outlineLable } from '../PatternHelpers'
import { BLANK_PATTERN } from '../Patterns'

// Tables start with a line consisting solely of "Table:". The term for "table" is
// configurable.
//
// Next, there's the header. The header is a line of semicolon-delimited values.
//
// Finally, there's the collection of rows. Like the header, each row is a line of
// semicolon-delimited values.
//
// Within a table, single blank lines are allowed. However, two consecutive blank
// lines terminates the table.
//
// A table must have a header, but it doesn't need to have any rows.
export function tryToParseTable(args: OutlineParserArgs): boolean {
  const lineConsumer = new LineConsumer(args.lines)

  let headerLine: string
  const tableTerm = args.config.settings.i18n.terms.table

  const isHeader = (
    lineConsumer.consume({ linePattern: outlineLable(tableTerm) })

    && !tryToTConsumeTwoConsecutiveBlankLines(lineConsumer)

    && lineConsumer.consume({
      then: line => {
        headerLine = line
      }
    }))

  if (!isHeader) {
    return false
  }

  const rawHeaderCells = getSemicolonDelimitedValues(headerLine)
  rawHeaderCells

  while (!lineConsumer.done() && !tryToTConsumeTwoConsecutiveBlankLines(lineConsumer)) {

  }

  return false
}


// Returns true if it's able to consume 2 blank lines.
//
// Note: If there was just 1 blank line, this function will consume it.
function tryToTConsumeTwoConsecutiveBlankLines(lineConsumer: LineConsumer): boolean {
  function consumeBlankLine(): boolean {
    return lineConsumer.consume({ linePattern: BLANK_PATTERN })
  }

  return consumeBlankLine() && consumeBlankLine()
}

function getSemicolonDelimitedValues(line: string): string[] {
  // TODO: Don't split on escaped semicolons
  // TODO: Trim each value
  return line.split(';')
}