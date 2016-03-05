import { TextConsumer } from '../TextConsumer'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { UnorderedListItemNode } from '../../SyntaxNodes/UnorderedListItemNode'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { DescriptionTermNode } from '../../SyntaxNodes/DescriptionTermNode'
import { DescriptionNode } from '../../SyntaxNodes/DescriptionNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { getOutlineNodes } from './GetOutlineNodes'
import { optional, startsWith, either, NON_BLANK, BLANK, INDENT, STREAK } from './Patterns'
import { last } from '../CollectionHelpers'
import { OutlineParser, OutlineParserArgs, } from './OutlineParser'

const NON_BLANK_PATTERN = new RegExp(
  NON_BLANK
)

const BLANK_PATTERN = new RegExp(
  BLANK
)

const INDENTED_PATTERN = new RegExp(
  startsWith(INDENT)
)

/*

// Description lists are collections of terms and descriptions.
//
// Terms are left-aligned; descriptions are indented and directly follow the corresponding terms.
//
// A single description can be associated with multiple terms.
export function parseDescriptionList(args: OutlineParserArgs): boolean {
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
        pattern: BLANK_PATTERN,
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
    listNode.addChild(
      new UnorderedListItemNode(getOutlineNodes(listItemContents))
    )
  }

  args.then([listNode], consumer.lengthConsumed())
  return true
}

*/