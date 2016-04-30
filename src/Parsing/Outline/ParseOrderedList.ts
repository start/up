import { LineConsumer } from './LineConsumer'
import { OrderedListNode, ListOrder } from '../../SyntaxNodes/OrderedListNode'
import { OrderedListItem } from '../../SyntaxNodes/OrderedListItem'
import { getOutlineNodes } from './GetOutlineNodes'
import { optional, startsWith, either, capture, INLINE_WHITESPACE_CHAR, BLANK, INDENT, INTEGER, STREAK } from './Patterns'
import { last } from '../CollectionHelpers'
import { OutlineParser, OutlineParserArgs, } from './OutlineParser'
import { getRemainingLinesOfListItem } from './GetRemainingLinesOfListItem'


const BULLETED_PATTERN = new RegExp(
  startsWith(
    optional(' ')
    + either(
      '#',
      capture(either(INTEGER, '#') + either('\\.', '\\)'))
    )
    + INLINE_WHITESPACE_CHAR
  )
)

const INTEGER_FOLLOWED_BY_PERIOD_PATTERN = new RegExp(
  INTEGER + '\\.'
)

const STREAK_PATTERN = new RegExp(
  STREAK
)

const BLANK_LINE_PATTERN = new RegExp(
  BLANK
)

const INDENTED_PATTERN = new RegExp(
  startsWith(INDENT)
)

// Ordered lists are simply collections of ordered list items.
//
// List items can contain any kind of convention, even other lists!  In list items
// with multiple lines, all subsequent lines are indented.
//
// List items don't need to be separated by blank lines.
export function parseOrderedList(args: OutlineParserArgs): boolean {
  const consumer = new LineConsumer(args.text)
  const rawListItems: RawListItem[] = []

  while (!consumer.done()) {
    let rawListItem = new RawListItem()

    const isLineBulleted = consumer.consumeLine({
      pattern: BULLETED_PATTERN,
      if: (line) => !STREAK_PATTERN.test(line),
      then: (line, bullet) => {
        rawListItem.bullet = bullet
        rawListItem.lines.push(line.replace(BULLETED_PATTERN, ''))
      }
    })

    if (!isLineBulleted) {
      break
    }
    
    let isListTerminated = false
    
    getRemainingLinesOfListItem({
      text: consumer.remainingText(),
      then: (lines, lengthParsed, shouldTerminateList) => {
        rawListItem.lines.push(...lines)
        consumer.advance(lengthParsed)
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
      getOutlineNodes(rawListItem.content(), args.config),
      getExplicitOrdinal(rawListItem)
    )
  })
  
  args.then([new OrderedListNode(listItems)], consumer.lengthConsumed())
  return true
}


class RawListItem {
  public bullet: string;
  public lines: string[] = [];
  
  content(): string {
    // This loses the final line break, but trailing blank lines are always ignored when parsing
    // for outline conventions.
    return this.lines.join('\n')
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


const INTEGER_PATTERN = new RegExp(
  capture(INTEGER)
)

function getExplicitOrdinal(rawListItem: RawListItem): number {
  const result = INTEGER_PATTERN.exec(rawListItem.bullet)
  return (result ? parseInt(result[1]) : null)
}
