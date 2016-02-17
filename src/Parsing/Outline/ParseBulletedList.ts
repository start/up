import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { BulletedListNode } from '../../SyntaxNodes/BulletedListNode'
import { BulletedListItemNode } from '../../SyntaxNodes/BulletedListItemNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { parseInline } from '../Inline/ParseInline'
import { parseOutline } from './ParseOutline'
import { optional, startsWith, either, INLINE_WHITESPACE_CHAR, BLANK, INDENT } from './Patterns'
import { ParseArgs, OnParse } from '../Parser'


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

// Bulleted lists are simply collections of bulleted list items.
//
// List items can contain any kind of convention, even other lists!  In list items
// with multiple lines, all subsequent lines are indented.
//
// List items can be separated by optional blank lines.
export function parseBulletedList(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {

  const consumer = new TextConsumer(text)

  const listItems: string[] = [] 
  let listItemLines: string[] = []

  while (!consumer.done()) {
    listItemLines = []
    
    const isLineBulleted = consumer.consumeLineIf(BULLET_PATTERN,
      (line) => listItemLines.push(line.replace(BULLET_PATTERN, ''))
    )

    // If this is a bulleted line, we're dealing with a list item.
    if (!isLineBulleted) {
      break
    }

    // Let's collect the rest of this list item (the next block of indented or blank lines).
    while (!consumer.done()) {
      
      const isLineIndented = consumer.consumeLineIf(INDENTED_PATTERN,
        (line) => listItemLines.push(line.replace(INDENTED_PATTERN, ''))
      )
      
      if (isLineIndented) {
        continue
      }
      
      const isLineBlank = consumer.consumeLineIf(BLANK_LINE_PATTERN,
        (line) => listItemLines.push(line)
      )
      
      if (!isLineBlank) {
        break
      }
    }

    // We lose the final newline, but trailing blank linesare always ignored when outline
    // parsing, which is exactly what we're going to do next. 
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

  onParse([listNode], consumer.countCharsAdvanced(), parseArgs.parentNode)
  return true
}