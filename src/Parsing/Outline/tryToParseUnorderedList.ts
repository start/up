import { LineConsumer } from './LineConsumer'
import { UnorderedList } from '../../SyntaxNodes/UnorderedList'
import { getOutlineSyntaxNodes } from './getOutlineSyntaxNodes'
import { getIndentedBlock } from './getIndentedBlock'
import { optional, patternStartingWith, anyCharFrom } from '../PatternHelpers'
import { INLINE_WHITESPACE_CHAR } from '../PatternPieces'
import { DIVIDER_STREAK_PATTERN } from '../Patterns'
import { OutlineParserArgs } from './OutlineParserArgs'


// Unordered lists are simply collections of bulleted list items.
//
// List items can contain any outline convention, even other lists! In list items with
// multiple lines, all subsequent lines are indented.
//
// List items don't need to be separated by blank lines, but when they are, 2 or more
// blank lines terminates the whole list.
export function tryToParseUnorderedList(args: OutlineParserArgs): boolean {
  const markupLineConsumer = new LineConsumer(args.markupLines)
  const listItems: UnorderedList.Item[] = []

  while (!markupLineConsumer.done()) {
    const linesOfMarkupInCurrentListItem: string[] = []

    const sourceLineNumberForCurrentListItem =
      args.sourceLineNumber + markupLineConsumer.countLinesConsumed

    const isLineBulleted = markupLineConsumer.consume({
      linePattern: BULLET_PATTERN,
      if: line => !DIVIDER_STREAK_PATTERN.test(line),
      thenBeforeConsumingLine: line => {
        linesOfMarkupInCurrentListItem.push(line.replace(BULLET_PATTERN, ''))
      }
    })

    if (!isLineBulleted) {
      break
    }

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
      new UnorderedList.Item(
        getOutlineSyntaxNodes({
          markupLines: linesOfMarkupInCurrentListItem,
          sourceLineNumber: sourceLineNumberForCurrentListItem,
          headingLeveler: args.headingLeveler,
          config: args.config
        })))

    if (shouldTerminateList) {
      break
    }
  }

  if (!listItems.length) {
    return false
  }

  args.then(
    [new UnorderedList(listItems)],
    markupLineConsumer.countLinesConsumed)

  return true
}

const BULLET_PATTERN =
  patternStartingWith(
    optional(' ') + anyCharFrom('*', '-', '•') + INLINE_WHITESPACE_CHAR)
