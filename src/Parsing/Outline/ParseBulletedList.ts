import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { BulletedListNode } from '../../SyntaxNodes/BulletedListNode'
import { BulletedListItemNode } from '../../SyntaxNodes/BulletedListItemNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { parseInline } from '../Inline/ParseInline'
import { parseOutline } from './ParseOutline'
import { optional, lineStartingWith, either, WHITESPACE_CHAR, BLANK_LINE, INDENT } from './Patterns'
import { ParseArgs, OnParse } from '../Parser'


const BULLETED_LINE_START = new RegExp(
  lineStartingWith(
    optional(' ') + either('\\*', '-', '\\+') + WHITESPACE_CHAR
  )
)

const INDENTED_LINE_START = new RegExp(
  lineStartingWith(INDENT)
)

// Bulleted lists are simply collections of bulleted list items.
//
// List items can contain any kind of convention, even other lists!  In list items
// with multiple lines, all subsequent lines are indented.
//
// List items can be separated by an optional blank line. Two consecutive blank lines
// indicates the end of the whole list.
export function parseBulletedList(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {

  const consumer = new TextConsumer(text)

  const listItems: string[] = []
  let currentListItem: string

  list_item_collector_loop:
  while (!consumer.done()) {

    const isBulletedLine = consumer.consumeLineIf(BULLETED_LINE_START, (line) => {
      currentListItem = line.replace(BULLETED_LINE_START, '')
    })

    if (!isBulletedLine) {
      break
    }

    // Okay, we're dealing with a list item. Now let's collect the rest of this list item's lines.
    while (!consumer.done()) {
      const isAnotherBulletedLine = BULLETED_LINE_START.test(consumer.remainingText())
       
      if (!isAnotherBulletedLine) {
        // We've found the start of the next list item.
        listItems.push(currentListItem)
        break
      }
    
      const isLineIndented = consumer.consumeLineIf(INDENTED_LINE_START, (line) => {
        currentListItem += line.replace(INDENTED_LINE_START, '')
      })

      if (isLineIndented) {
        continue
      }

      if (isListTerminator(consumer.remainingText())) {
        // Dang, the list is over. Let's include the current list item...
        listItems.push(currentListItem)
        
        // ...and bail! We don't consume the list terminator, because we need to leave those blank
        // lines for the outline parser to deal figure out.
        break list_item_collector_loop
      }

      if (consumer.consumeLineIf(BLANK_LINE)) {
        // Since we know we aren't dealing with a list terminator (2+ consecutive blank lines),
        // it's safe to consume this single blank line and continue parsing the list item. To be
        // clear, any blank lines in a list item do *not* need to be indented.
        continue
      }
      
      // If we've made it this far, that means the current line is neither blank nor indented.
      // It could be the start of another bulleted list item, or it could indicate the end of
      // the list (e.g. a paragraph after the list). Let's include the current list item, then
      // see if we can parse the next one.
      listItems.push(currentListItem)
      break
    }
  }

  if (!listItems.length) {
    return false
  }
  
  const listNode = new BulletedListNode(parseArgs.parentNode)

  // Parse each list item like its own mini-document
  for (var listItem in listItems) {
    parseOutline(listItem, { parentNode: new BulletedListItemNode(listNode) },
      (outlineNodes, countCharsAdvanced, listItemNode) => {
        listItemNode.addChildren(outlineNodes)
        listNode.addChild(listItemNode)
      })
  }
  
  onParse([listNode], consumer.countCharsAdvanced(), parseArgs.parentNode)
  return true 
}

function isListTerminator(text: string) {
  const consumer = new TextConsumer(text)

  return (
    consumer.consumeLineIf(BLANK_LINE)
    && consumer.consumeLineIf(BLANK_LINE)
  )
}