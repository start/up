import { TextConsumer } from '../TextConsumer'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { UnorderedListItemNode } from '../../SyntaxNodes/UnorderedListItemNode'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { DescriptionTermNode } from '../../SyntaxNodes/DescriptionTermNode'
import { DescriptionNode } from '../../SyntaxNodes/DescriptionNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { getOutlineNodes } from './GetOutlineNodes'
import { isLineFancyOutlineConvention } from './IsLineFancyOutlineConvention'
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
    let terms: string[] = []

    // First, we collect every term for the next description
    while (!consumer.done()) {
      const isValidTerm = consumer.consumeLine({
        pattern: NON_BLANK_PATTERN,
        if: (line) => !INDENTED_PATTERN.test(line) && !isLineFancyOutlineConvention(line),
        then: (line) => terms.push(line)
      })
      
      if (!isValidTerm) {
        break
      }
    }

    if (!terms.length) {
      break
    }

    // Next, we collect every line in the description
    const descriptionContents: string[] = []
    
    while (!consumer.done()) {

      const isLineIndented = consumer.consumeLine({
        pattern: INDENTED_PATTERN,
        then: (line) => terms.push(line.replace(INDENTED_PATTERN, ''))
      })

      if (isLineIndented) {
        continue
      }

      const isLineBlank = consumer.consumeLine({
        pattern: BLANK_PATTERN,
        then: (line) => descriptionContents.push(line)
      })

      if (!isLineBlank) {
        // Well, the line was neither indented nor blank. That means it's either another term, or it's
        // the first line following the description list. Let's leave this inner loop and find out which.
        break
      }
    }
    
    if (!descriptionContents.length) {
      break
    }

    // This loses the final newline, but trailing blank lines are always ignored when parsing for
    // outline conventions, which is exactly what we're going to do next. 
    listItemsContents.push(terms.join('\n'))
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