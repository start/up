import { TextConsumer } from '../TextConsumer'
import { BulletedListNode } from '../../SyntaxNodes/BulletedListNode'
import { BulletedListItemNode } from '../../SyntaxNodes/BulletedListItemNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { parseInline } from '../Inline/ParseInline'
import { parseOutline } from './ParseOutline'
import { optional, startsWith, either, INLINE_WHITESPACE_CHAR, BLANK, INDENT, STREAK } from './Patterns'
import { ParseContext, OnParse } from '../Parser'
import { last } from '../CollectionHelpers'

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

// Bulleted lists are simply collections of bulleted list items.
//
// List items can contain any kind of convention, even other lists!  In list items
// with multiple lines, all subsequent lines are indented.
//
// List items don't need to be separated by blank lines.
export function parseBulletedList(text: string, parseArgs: ParseContext, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)

  const listItems: string[] = []
  let listItemLines: string[]

  while (!consumer.done()) {
    listItemLines = []

    const isLineBulleted = consumer.consumeLine({
      if: (line) => BULLET_PATTERN.test(line) && !STREAK_PATTERN.test(line),
      then: (line) => listItemLines.push(line.replace(BULLET_PATTERN, ''))
    })

    if (!isLineBulleted) {
      break
    }

    // Let's collect the rest of this list item (i.e. the next block of indented or blank lines).
    while (!consumer.done()) {

      const isLineIndented = consumer.consumeLineIfMatches({
        pattern: INDENTED_PATTERN,
        then: (line) => listItemLines.push(line.replace(INDENTED_PATTERN, ''))
      })

      if (isLineIndented) {
        continue
      }

      const isLineBlank = consumer.consumeLineIfMatches({
        pattern: BLANK_LINE_PATTERN,
        then: (line) => listItemLines.push(line)
      })

      if (!isLineBlank) {
        // Well, the line was neither indented nor blank. That means it's either the start of
        // another list item, or it's the first line following the list. Let's leave this loop
        // and find out which.
        break
      }
    }

    // This loses the final newline, but trailing blank lines are always ignored when parsing for
    // outline conventions, which is exactly what we're going to do next. 
    listItems.push(listItemLines.join('\n'))
  }

  if (!listItems.length) {
    return false
  }

  const listNode = new BulletedListNode(parseArgs.parentNode)

  // Parse each list item like its own mini-document
  for (var listItem of listItems) {
    parseOutline(listItem, { parentNode: new BulletedListItemNode(listNode) },
      (outlineNodes, countCharsAdvanced, listItemNode) => {
        listItemNode.addChildren(outlineNodes)
        listNode.addChild(listItemNode)
      })
  }

  onParse([listNode], consumer.countCharsConsumed(), parseArgs.parentNode)
  return true
}