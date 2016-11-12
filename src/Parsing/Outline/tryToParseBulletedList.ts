import { LineConsumer } from './LineConsumer'
import { BulletedList } from '../../SyntaxNodes/BulletedList'
import { getOutlineSyntaxNodes } from './getOutlineSyntaxNodes'
import { getIndentedBlock } from './getIndentedBlock'
import { optional, patternStartingWith, anyCharFrom } from '../../PatternHelpers'
import { INLINE_WHITESPACE_CHAR } from '../../PatternPieces'
import { OutlineParserArgs } from './OutlineParserArgs'


// Bulleted lists are simply collections of bulleted list items.
//
// List items can contain any outline convention, even other lists! In list items with
// multiple lines, all subsequent lines are indented.
//
// List items don't need to be separated by blank lines, but when they are, 2 or more
// blank lines terminates the whole list.
export function tryToParseBulletedList(args: OutlineParserArgs): boolean {
  const markupLineConsumer = new LineConsumer(args.markupLines)
  const listItems: BulletedList.Item[] = []

  while (!markupLineConsumer.done) {
    const linesOfMarkupInCurrentListItem: string[] = []

    const sourceLineNumberForCurrentListItem =
      args.sourceLineNumber + markupLineConsumer.countLinesConsumed

    const bulletedLineResult = markupLineConsumer.consumeLineIfMatches(BULLETED_LINE_PATTERN)

    if (!bulletedLineResult) {
      break
    }

    linesOfMarkupInCurrentListItem.push(
      bulletedLineResult.line.replace(BULLETED_LINE_PATTERN, ''))

    let shouldTerminateList = false

    // Let's collect the rest of the lines in the current list item (if there are any)  
    getIndentedBlock({
      lines: markupLineConsumer.remaining(),
      then: (indentedLines, countLinesConsumed, hasMultipleTrailingBlankLines) => {
        linesOfMarkupInCurrentListItem.push(...indentedLines)
        markupLineConsumer.skipLines(countLinesConsumed)
        shouldTerminateList = hasMultipleTrailingBlankLines
      }
    })

    listItems.push(
      new BulletedList.Item(
        getOutlineSyntaxNodes({
          markupLines: linesOfMarkupInCurrentListItem,
          sourceLineNumber: sourceLineNumberForCurrentListItem,
          headingLeveler: args.headingLeveler,
          settings: args.settings
        })))

    if (shouldTerminateList) {
      break
    }
  }

  if (!listItems.length) {
    return false
  }

  args.then(
    [new BulletedList(listItems)],
    markupLineConsumer.countLinesConsumed)

  return true
}

const BULLETED_LINE_PATTERN =
  patternStartingWith(
    optional(' ') + anyCharFrom('*', '-', '•') + INLINE_WHITESPACE_CHAR)
