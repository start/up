import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { parseInline } from '../Inline/ParseInline'
import { parseOutline } from './ParseOutline'
import { optional, lineStartingWith, either, WHITESPACE_CHAR, BLANK_LINE, INDENT } from './Patterns'
import { ParseArgs, OnParse } from '../Parser'


const BULLETED_LINE_START = new RegExp(
  lineStartingWith(
    optional(WHITESPACE_CHAR) + either('\\*', '-', '\\+') + WHITESPACE_CHAR
  )
)

const INDENTED_LINE_START = new RegExp(
  lineStartingWith(INDENT)
)

// Bulleted lists are simply collections of bulleted list items.
//
// Each bulleted list item can contain any convention, even other lists! To include more than
// one line in a list item, indent any subsequent lines.
//
// List items can be separated by an optional blank line. Two consecutive blank lines end both
// the list item and the whole list itself.
export function parseBlockquote(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {

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

    // Okay, we're dealing with a list item. Now let's collect the rest of the list item's lines.
    while (!consumer.done()) {
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
      
      // Uh-oh. If we've made it this far, that means the current line is neither blank nor indented.
      // Our list is over!
      listItems.push(currentListItem)
      break list_item_collector_loop
    }
  }

  if (!listItems.length) {
    return false
  }

  const lines: string[] = []

  // Collect all consecutive lines starting with "> "
  while (consumer.consumeLineIf(BULLETED_LINE_START, (line) => { lines.push(line) })) { }

  if (!lines.length) {
    return false
  }
  
  // Strip "> " from each line, then stick them all back together. See where this is going?
  let blockquoteContent = lines
    .map((line) => line.replace(BULLETED_LINE_START, ''))
    .join('\n')

  // Parse the contents of the blockquote as though it's a mini-document. Because it is!
  return parseOutline(blockquoteContent, { parentNode: new BlockquoteNode(parseArgs.parentNode) },
    (contentNodes, countCharsParsed, blockquoteNode) => {
      blockquoteNode.addChildren(contentNodes)
      onParse([blockquoteNode], consumer.countCharsAdvanced(), parseArgs.parentNode)
    })
}

function isListTerminator(text: string) {
  const consumer = new TextConsumer(text)

  return (
    consumer.consumeLineIf(BLANK_LINE)
    && consumer.consumeLineIf(BLANK_LINE)
  )
}