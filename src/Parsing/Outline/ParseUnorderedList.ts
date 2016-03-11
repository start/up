import { TextConsumer } from '../TextConsumer'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { UnorderedListItem } from '../../SyntaxNodes/UnorderedListItem'
import { getOutlineNodes } from './GetOutlineNodes'
import { getRemainingLinesOfListItem } from './GetRemainingLinesOfListItem'
import { optional, startsWith, either, INLINE_WHITESPACE_CHAR, BLANK, INDENT, STREAK } from './Patterns'
import { last } from '../CollectionHelpers'
import { OutlineParser, OutlineParserArgs, } from './OutlineParser'

const BULLET_PATTERN = new RegExp(
  startsWith(
    optional(' ') + either('\\*', '-', '\\+') + INLINE_WHITESPACE_CHAR
  )
)

const BLANK_LINE_PATTERN = new RegExp(
  BLANK
)

const INDENTED_PATTERN = new RegExp(
  startsWith(INDENT)
)

const STREAK_PATTERN = new RegExp(
  STREAK
)

// Unordered lists are simply collections of bulleted list items.
//
// List items can contain any kind of convention, even other lists!  In list items
// with multiple lines, all subsequent lines are indented.
//
// List items don't need to be separated by blank lines.
export function parseUnorderedList(args: OutlineParserArgs): boolean {
  const consumer = new TextConsumer(args.text)
  const listItemsContents: string[] = []

  while (!consumer.done()) {
    let listItemLines: string[] = []

    const isLineBulleted = consumer.consumeLine({
      pattern: BULLET_PATTERN,
      if: (line) => !STREAK_PATTERN.test(line),
      then: (line) => listItemLines.push(line.replace(BULLET_PATTERN, ''))
    })

    if (!isLineBulleted) {
      break
    }
    
    let isListTerminated = false
    
    getRemainingLinesOfListItem({
      text: consumer.remainingText(),
      then: (lines, lengthParsed, shouldTerminateList) => {
        listItemLines.push(...lines)
        consumer.skip(lengthParsed)
        isListTerminated = shouldTerminateList
      }
    })

    listItemsContents.push(listItemLines.join('\n'))
    
    if (isListTerminated) {
      break
    }
  }

  if (!listItemsContents.length) {
    return false
  }

  const listItems =
    listItemsContents.map((listItemContents) =>
      new UnorderedListItem(getOutlineNodes(listItemContents)))
 
  args.then([new UnorderedListNode(listItems)], consumer.lengthConsumed())
  return true
}