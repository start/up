import { TextConsumer } from '../TextConsumer'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { UnorderedListItemNode } from '../../SyntaxNodes/UnorderedListItemNode'
import { DescriptionListItemNode } from '../../SyntaxNodes/DescriptionListItemNode'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { DescriptionTermNode } from '../../SyntaxNodes/DescriptionTermNode'
import { DescriptionNode } from '../../SyntaxNodes/DescriptionNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { getInlineNodes } from '../Inline/GetInlineNodes'
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


// Description lists are collections of terms and descriptions.
//
// Terms are left-aligned; descriptions are indented and directly follow the corresponding terms.
//
// A single description can be associated with multiple terms.
export function parseDescriptionList(args: OutlineParserArgs): boolean {
  const consumer = new TextConsumer(args.text)
  const listItemNodes: DescriptionListItemNode[] = []

  while (!consumer.done()) {
    let terms: string[] = []

    // First, we collect every term for the next description
    while (!consumer.done()) {
      const isTerm = consumer.consumeLine({
        pattern: NON_BLANK_PATTERN,
        if: (line) => !INDENTED_PATTERN.test(line) && !isLineFancyOutlineConvention(line),
        then: (line) => terms.push(line)
      })

      if (!isTerm) {
        break
      }
    }

    if (!terms.length) {
      break
    }

    // Next, the description's first line
    const descriptionContents: string[] = []

    const hasDescription = consumer.consumeLine({
      pattern: INDENTED_PATTERN,
      if: (line) => !BLANK_PATTERN.test(line),
      then: (line) => descriptionContents.push(line.replace(INDENTED_PATTERN, ''))
    })

    if (hasDescription) {
      break
    }
    
    // Finally, we collect the rest of the lines in the description
    while (!consumer.done()) {

      const isLineIndented = consumer.consumeLine({
        pattern: INDENTED_PATTERN,
        then: (line) => descriptionContents.push(line.replace(INDENTED_PATTERN, ''))
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

    const termNodes =
      terms.map((term) => new DescriptionTermNode(getInlineNodes(term)))

    const descriptionNode =
      new DescriptionNode(
        getOutlineNodes(descriptionContents.join('\n')))

    listItemNodes.push(new DescriptionListItemNode(termNodes, descriptionNode))
  }

  if (!listItemNodes.length) {
    return false
  }

  args.then([new DescriptionListNode(listItemNodes)], consumer.lengthConsumed())
  return true
}