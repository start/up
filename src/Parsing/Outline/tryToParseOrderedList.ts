import { LineConsumer } from './LineConsumer'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { getOutlineNodes } from './getOutlineNodes'
import { optional, patternStartingWith, escapeForRegex, atLeast, either, anyCharFrom, capture } from '../PatternHelpers'
import { INLINE_WHITESPACE_CHAR, DIGIT } from '../PatternPieces'
import { DIVIDER_STREAK_PATTERN } from '../Patterns'
import { OutlineParserArgs } from './OutlineParserArgs'
import { getIndentedBlock } from './getIndentedBlock'


// Ordered lists are simply collections of ordered list items.
//
// List items can contain any outline convention, even other lists!  In list items with
// multiple lines, all subsequent lines are indented.
//
// List items don't need to be separated by blank lines, but when they are, 2 or more
// blank lines terminates the whole list.
export function trytoParseOrderedList(args: OutlineParserArgs): boolean {
  const lineConsumer = new LineConsumer(args.lines)
  const rawListItems: RawListItem[] = []

  while (!lineConsumer.done()) {
    let rawListItem: RawListItem

    const isLineBulleted = lineConsumer.consume({
      linePattern: BULLETED_PATTERN,
      if: line => !DIVIDER_STREAK_PATTERN.test(line),
      then: (line, bullet) => {
        rawListItem = new RawListItem(bullet)
        rawListItem.lines.push(line.replace(BULLETED_PATTERN, ''))
      }
    })

    if (!isLineBulleted) {
      break
    }

    let shouldTerminateList = false

    getIndentedBlock({
      lines: lineConsumer.getRemainingLines(),
      then: (indentedLines, countLinesConsumed, hasMultipleTrailingBlankLines) => {
        rawListItem.lines.push(...indentedLines)
        lineConsumer.skipLines(countLinesConsumed)
        shouldTerminateList = hasMultipleTrailingBlankLines
      }
    })

    rawListItems.push(rawListItem)

    if (shouldTerminateList) {
      break
    }
  }

  if (!isAnOrderedList(rawListItems)) {
    return false
  }

  let listItems = rawListItems.map((rawListItem) => {
    return new OrderedListNode.Item(
      getOutlineNodes(rawListItem.lines, args.headingLeveler, args.config),
      getExplicitOrdinal(rawListItem))
  })

  args.then([new OrderedListNode(listItems)], lineConsumer.countLinesConsumed)
  return true
}


class RawListItem {
  lines: string[] = []

  constructor(public bullet: string) { }
}


function isAnOrderedList(rawListItems: RawListItem[]): boolean {
  const { length } = rawListItems

  return (
    // If there aren't any list items, we're not dealing with an ordered list.
    length > 0
    && (
      // There are five ways to bullet an ordered list:
      //
      // 1. An integer followed by a period
      // 2) An integer followed by a closing parenthesis 
      // # A number sign (this and all other bullets must be followed by a space)
      // #. A number sign followed by a period
      // #) A number sign followed by a closing parenthesis
      //
      // The first one is potentially unclear. Look at the following paragraph:
      //
      //   1783. Not a good year for Great Britain.
      // 
      // Did the author intend the paragraph be an ordered list with a single item? Probably not.
      //
      // Therefore, if the first bullet style is used, we require more than one list item.
      (length > 1) || !BULLETED_BY_INTEGER_FOLLOWED_BY_PERIOD_PATTERN.test(rawListItems[0].bullet)))
}


function getExplicitOrdinal(rawListItem: RawListItem): number {
  const result = FIRST_INTEGER_PATTERN.exec(rawListItem.bullet)

  return (
    result
      ? parseInt(result[0], 10)
      : undefined)
}


export const INTEGER =
  optional(escapeForRegex('-')) + atLeast(1, DIGIT)

const FIRST_INTEGER_PATTERN =
  new RegExp(INTEGER)

const BULLET =
  either(
    '#',
    capture(either(INTEGER, '#') + anyCharFrom('.', ')')))

const BULLETED_PATTERN =
  patternStartingWith(
    optional(' ') + BULLET + INLINE_WHITESPACE_CHAR)

const BULLETED_BY_INTEGER_FOLLOWED_BY_PERIOD_PATTERN =
  patternStartingWith(INTEGER + '\\.')
