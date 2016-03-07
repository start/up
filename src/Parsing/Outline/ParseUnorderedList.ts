import { TextConsumer } from '../TextConsumer'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { UnorderedListItemNode } from '../../SyntaxNodes/UnorderedListItemNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { getOutlineNodes } from './GetOutlineNodes'
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

    // Let's collect the rest of this list item (i.e. the next block of indented or blank lines).
    while (!consumer.done()) {

      const isLineIndented = consumer.consumeLine({
        pattern: INDENTED_PATTERN,
        then: (line) => listItemLines.push(line.replace(INDENTED_PATTERN, ''))
      })

      if (isLineIndented) {
        continue
      }

      const isLineBlank = consumer.consumeLine({
        pattern: BLANK_LINE_PATTERN,
        then: (line) => listItemLines.push(line)
      })

      if (!isLineBlank) {
        // Well, the line was neither indented nor blank. That means it's either the start of
        // another list item, or it's the first line following the list. Let's leave this inner
        // loop and find out which.
        break
      }
    }

    // This loses the final newline, but trailing blank lines are always ignored when parsing for
    // outline conventions, which is exactly what we're going to do next. 
    listItemsContents.push(listItemLines.join('\n'))
  }

  if (!listItemsContents.length) {
    return false
  }

  const listNode = new UnorderedListNode()

  // Parse each list item like its own mini-document
  for (const listItemContents of listItemsContents) {
    listNode.children.push(
      new UnorderedListItemNode(getOutlineNodes(listItemContents))
    )
  }

  args.then([listNode], consumer.lengthConsumed())
  return true
}