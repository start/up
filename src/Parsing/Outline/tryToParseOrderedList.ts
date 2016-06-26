import { LineConsumer } from './LineConsumer'
import { OrderedListNode, OrderedListOrder } from '../../SyntaxNodes/OrderedListNode'
import { OrderedListItem } from '../../SyntaxNodes/OrderedListItem'
import { getOutlineNodes } from './getOutlineNodes'
import { optional, regExpStartingWith, either, anyCharFrom, capture } from '../PatternHelpers'
import { INLINE_WHITESPACE_CHAR, INTEGER } from '../PatternPieces'
import { DIVIDER_STREAK_PATTERN } from '../Patterns'
import { INPUT_LINE_BREAK } from '../Strings'
import { OutlineParserArgs } from './OutlineParserArgs'
import { getRemainingLinesOfListItem } from './getRemainingLinesOfListItem'


// Ordered lists are simply collections of ordered list items.
//
// List items can contain any kind of convention, even other lists!  In list items
// with multiple lines, all subsequent lines are indented.
//
// List items don't need to be separated by blank lines.
export function trytoParseOrderedList(args: OutlineParserArgs): boolean {
  const consumer = new LineConsumer(args.text)
  const rawListItems: RawListItem[] = []

  while (!consumer.reachedEndOfText()) {
    let rawListItem: RawListItem

    const isLineBulleted = consumer.consume({
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

    let isListTerminated = false

    getRemainingLinesOfListItem({
      text: consumer.remainingText,
      then: (lines, lengthParsed, shouldTerminateList) => {
        rawListItem.lines.push(...lines)
        consumer.advanceTextIndex(lengthParsed)
        isListTerminated = shouldTerminateList
      }
    })

    rawListItems.push(rawListItem)

    if (isListTerminated) {
      break
    }
  }

  if (!rawListItems.length || isProbablyNotAnOrderedList(rawListItems)) {
    return false
  }

  let listItems = rawListItems.map((rawListItem) => {
    return new OrderedListItem(
      getOutlineNodes(rawListItem.content(), args.headingLeveler, args.config),
      getExplicitOrdinal(rawListItem)
    )
  })

  args.then([new OrderedListNode(listItems)], consumer.textIndex)
  return true
}


class RawListItem {
  lines: string[] = []

  constructor(public bullet: string) { }

  content(): string {
    // This loses any final line break, but trailing blank lines are always ignored when parsing
    // outline conventions.
    return this.lines.join(INPUT_LINE_BREAK)
  }
}


function isProbablyNotAnOrderedList(rawListItems: RawListItem[]): boolean {
  // There are five ways to bullet an ordered list:
  //
  // 1. An integer followed by a period
  // 2) An integer followed by a right parenthesis 
  // # A number sign (this and all other bullets must be followed by a space)
  // #. A number sign followed by a period
  // #) A number sign followed by a right parenthesis
  //
  // The first one is potentially unclear. Look at the following paragraph:
  //
  // 1783. Not a good year for Great Britain.
  // 
  // Did the author intend the paragraph be an ordered list with a single item? Probably not.
  //
  // Therefore, if the first bullet style is used, there must be more than one list item.
  return (
    rawListItems.length === 1
    && INTEGER_FOLLOWED_BY_PERIOD_PATTERN.test(rawListItems[0].bullet)
  )
}


function getExplicitOrdinal(rawListItem: RawListItem): number {
  const result = CAPTURE_INTEGER_PATTERN.exec(rawListItem.bullet)

  return (
    result
      ? parseInt(result[1])
      : null)
}


const CAPTURE_INTEGER_PATTERN =
  new RegExp(capture(INTEGER))

const BULLET =
  either(
    '#',
    capture(either(INTEGER, '#') + anyCharFrom('.', ')')))

const BULLETED_PATTERN =
  regExpStartingWith(
    optional(' ') + BULLET + INLINE_WHITESPACE_CHAR)

const INTEGER_FOLLOWED_BY_PERIOD_PATTERN =
  regExpStartingWith(INTEGER + '\\.')
