import { LineConsumer } from './LineConsumer'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { UnorderedListItem } from '../../SyntaxNodes/UnorderedListItem'
import { getOutlineNodes } from './getOutlineNodes'
import { getIndentedBlock } from './getIndentedBlock'
import { optional, patternStartingWith, anyCharFrom } from '../PatternHelpers'
import { INLINE_WHITESPACE_CHAR } from '../PatternPieces'
import { DIVIDER_STREAK_PATTERN } from '../Patterns'
import { OutlineParserArgs } from './OutlineParserArgs'


// Unordered lists are simply collections of bulleted list items.
//
// List items can contain any kind of convention, even other lists! In list items with
// multiple lines, all subsequent lines are indented.
//
// List items don't need to be separated by blank lines, but when they are, 2 or more
// blank lines terminates the whole list.
export function tryToParseUnorderedList(args: OutlineParserArgs): boolean {
  const consumer = new LineConsumer(args.lines)
  const linesByListItem: string[][] = []

  while (!consumer.done()) {
    let linesForCurrentListItem: string[] = []

    const isLineBulleted = consumer.consume({
      linePattern: BULLET_PATTERN,
      if: line => !DIVIDER_STREAK_PATTERN.test(line),
      then: line => {
        linesForCurrentListItem.push(line.replace(BULLET_PATTERN, ''))
      }
    })

    if (!isLineBulleted) {
      break
    }

    let shouldTerminateList = false

    getIndentedBlock({
      lines: consumer.getRemainingLines(),
      then: (lines, lengthParsed, hasMultipleTrailingBlankLines) => {
        linesForCurrentListItem.push(...lines)
        consumer.skipLines(lengthParsed)
        shouldTerminateList = hasMultipleTrailingBlankLines
      }
    })

    linesByListItem.push(linesForCurrentListItem)

    if (shouldTerminateList) {
      break
    }
  }

  if (!linesByListItem.length) {
    return false
  }

  const listItems =
    linesByListItem.map((lines) =>
      new UnorderedListItem(getOutlineNodes(lines, args.headingLeveler, args.config)))

  args.then([new UnorderedListNode(listItems)], consumer.countLinesConsumed)
  return true
}

const BULLET_PATTERN =
  patternStartingWith(
    optional(' ') + anyCharFrom('*', '-', '+', '•') + INLINE_WHITESPACE_CHAR)
