import { TextConsumer } from '../TextConsumer'
import { OrderedListNode, ListOrder } from '../../SyntaxNodes/OrderedListNode'
import { OrderedListItemNode } from '../../SyntaxNodes/OrderedListItemNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { getOutlineNodes } from './GetOutlineNodes'
import { optional, startsWith, either, capture, INLINE_WHITESPACE_CHAR, BLANK, INDENT, INTEGER } from './Patterns'
import { last } from '../CollectionHelpers'
import { OutlineParser, OutlineParserArgs, } from './OutlineParser'


const BULLETED_PATTERN = new RegExp(
  startsWith(
    optional(' ')
    + capture(either(INTEGER, '#') + either('\\.', '\\)'))
    + INLINE_WHITESPACE_CHAR
  )
)

const INTEGER_THEN_PERIOD_PATTERN = new RegExp(
  optional(' ') + INTEGER + '\\.' + INLINE_WHITESPACE_CHAR
)

const BLANK_LINE_PATTERN = new RegExp(
  BLANK
)

const INDENTED_PATTERN = new RegExp(
  startsWith(INDENT)
)
/*
// Bulleted lists are simply collections of bulleted list items.
//
// List items can contain any kind of convention, even other lists!  In list items
// with multiple lines, all subsequent lines are indented.
//
// List items don't need to be separated by blank lines.
export function parseOrderedList(args: OutlineParserArgs): boolean {
  const consumer = new TextConsumer(args.text)

  const rawListItems: RawListItem[] = []

  let didAuthorIntendThisToBeAnOrderedList = false
  let order = ListOrder.Ascending

  while (!consumer.done()) {
    let rawListItem = new RawListItem()

    const isLineBulleted = consumer.consumeLineIfMatches({
      pattern: BULLETED_PATTERN,
      then: (line, bullet) => {
        rawListItem.bullet = bullet 
        rawListItem.lines.push(line.replace(BULLETED_PATTERN, ''))
      }
    })

    if (!isLineBulleted) {
      break
    }
    
    // Let's collect the rest of this list item (i.e. the next block of indented or blank lines).
    while (!consumer.done()) {

      const isLineIndented = consumer.consumeLineIfMatches({
        pattern: INDENTED_PATTERN,
        then: (line) => rawListItem.lines.push(line.replace(INDENTED_PATTERN, ''))
      })

      if (isLineIndented) {
        continue
      }

      const isLineBlank = consumer.consumeLineIfMatches({
        pattern: BLANK_LINE_PATTERN,
        then: (line) => rawListItem.lines.push(line)
      })

      if (!isLineBlank) {
        // Well, the line was neither indented nor blank. That means it's either the start of
        // another list item, or it's the first line following the list. Let's leave this loop
        // and find out which.
        break
      }
    }
 
    rawListItems.push(rawListItem)
  }

  if (!didAuthorIntendThisToBeAnOrderedList) {
    return false
  }

  const listNode = new OrderedListNode()

  // Parse each list item like its own mini-document
  for (var listItemContents of contentsOfListItems) {
    listNode.addChild(
      new OrderedListItemNode(getOutlineNodes(listItemContents))
    )
  }

  args.then([listNode], consumer.lengthConsumed())
  return true
}

class RawListItem {
  public bullet: string;
  public lines: string[] = [];
}

        */
/*

        // There are four ways to bullet an ordered list:
        //
        // 1. An integer followed by a period
        // 2) An integer followed by a right parenthesis 
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
        const isThereAlreadyAnotherListItem = (contentsOfListItems.length > 0)

        didAuthorIntendThisToBeAnOrderedList = (
          isThereAlreadyAnotherListItem
          || !BULLETED_BY_INTEGER_THEN_PERIOD_PATTERN.test(line)
        )
        
        */
        