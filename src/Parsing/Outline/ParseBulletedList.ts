import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { BulletedListNode } from '../../SyntaxNodes/BulletedListNode'
import { BulletedListItemNode } from '../../SyntaxNodes/BulletedListItemNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { parseInline } from '../Inline/ParseInline'
import { parseOutline } from './ParseOutline'
import { optional, lineStartingWith, either, WHITESPACE_CHAR, BLANK_LINE, INDENT } from './Patterns'
import { ParseArgs, OnParse } from '../Parser'


const BULLET_PATTERN = new RegExp(
  lineStartingWith(
    optional(' ') + either('\\*', '-', '\\+') + WHITESPACE_CHAR
  )
)


const INDENTED_OR_BLANK_LINE_PATTERN = new RegExp(
  either(
    lineStartingWith(INDENT),
    BLANK_LINE
  )
)

// Bulleted lists are simply collections of bulleted list items.
//
// List items can contain any kind of convention, even other lists!  In list items
// with multiple lines, all subsequent lines are indented.
//
// List items can be separated by an optional blank line.
export function parseBulletedList(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {

  const consumer = new TextConsumer(text)

  const listItems: string[] = []
  let listItemLines: string[] = []

  list_item_collector_loop:
  while (!consumer.done()) {

    if (!consumer.consumeLineIf(BULLET_PATTERN, (line) => { listItemLines.push(line.replace(BULLET_PATTERN, '')) })) {
      break
    }

    // Okay, we're dealing with a list item. Now let's collect the rest of this list item.
    while (!consumer.done()) {
      
      // Include the next block of indented or blank lines
      //
      // TODO: Do not include trailing blank lines. They should be parsed outside of the list.
      if (!consumer.consumeLineIf(INDENTED_OR_BLANK_LINE_PATTERN, (line) => listItemLines.push(line))) {
        break
      }
    }

    listItems.push(listItemLines.join('\n'))
    listItemLines = []
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

  onParse([listNode], consumer.countCharsAdvanced(), parseArgs.parentNode)
  return true
}