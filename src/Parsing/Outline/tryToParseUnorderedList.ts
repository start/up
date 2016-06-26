import { LineConsumer } from './LineConsumer'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { UnorderedListItem } from '../../SyntaxNodes/UnorderedListItem'
import { getOutlineNodes } from './getOutlineNodes'
import { getRemainingLinesOfListItem } from './getRemainingLinesOfListItem'
import { optional, regExpStartingWith, anyCharFrom, escapeForRegex } from '../PatternHelpers'
import { INLINE_WHITESPACE_CHAR } from '../PatternPieces'
import { DIVIDER_STREAK_PATTERN } from '../Patterns'
import { INPUT_LINE_BREAK } from '../Strings'
import { OutlineParserArgs } from './OutlineParserArgs'


// Unordered lists are simply collections of bulleted list items.
//
// List items can contain any kind of convention, even other lists! In list items
// with multiple lines, all subsequent lines are indented.
//
// List items don't need to be separated by blank lines.
export function tryToParseUnorderedList(args: OutlineParserArgs): boolean {
  const consumer = new LineConsumer(args.text)
  const rawListItemsContents: string[] = []

  while (!consumer.reachedEndOfText()) {
    let rawListItemLines: string[] = []

    const isLineBulleted = consumer.consume({
      linePattern: BULLET_PATTERN,
      if: line => !DIVIDER_STREAK_PATTERN.test(line),
      then: line => rawListItemLines.push(line.replace(BULLET_PATTERN, ''))
    })

    if (!isLineBulleted) {
      break
    }

    let isListTerminated = false

    getRemainingLinesOfListItem({
      text: consumer.remainingText,
      then: (lines, lengthParsed, shouldTerminateList) => {
        rawListItemLines.push(...lines)
        consumer.advanceTextIndex(lengthParsed)
        isListTerminated = shouldTerminateList
      }
    })

    rawListItemsContents.push(rawListItemLines.join(INPUT_LINE_BREAK))

    if (isListTerminated) {
      break
    }
  }

  if (!rawListItemsContents.length) {
    return false
  }

  const listItems =
    rawListItemsContents.map((rawContents) =>
      new UnorderedListItem(getOutlineNodes(rawContents, args.headingLeveler, args.config)))

  args.then([new UnorderedListNode(listItems)], consumer.textIndex)
  return true
}

const BULLET_PATTERN =
  regExpStartingWith(
    optional(' ') + anyCharFrom('*', '-', '+', '•') + INLINE_WHITESPACE_CHAR)
