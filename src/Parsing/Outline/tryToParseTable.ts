import { LineConsumer } from './LineConsumer'
// import { TableNode } from '../../SyntaxNodes/TableNode'
import { OutlineParserArgs } from './OutlineParserArgs'
import { outlineLable } from '../PatternHelpers'
// import { BLANK_PATTERN } from '../Patterns'

// Tables start with a line consisting solely of "Table:".
//
// Next, there's the header. The header is a line of semicolon-delimited values.
//
// Finally, there's the collection of rows. Like the header, each row is a line of
// semicolon-delimited values.
//
// Within a table, single blank lines are allowed. However, two consecutive blank
// lines terminates the table.
export function tryToParseTable(args: OutlineParserArgs): boolean {
  const lineConsumer = new LineConsumer(args.lines)

  const tableTerm = args.config.settings.i18n.terms.table

  if (!lineConsumer.consume({ linePattern: outlineLable(tableTerm) })) {
    return false
  }

  return false
}
