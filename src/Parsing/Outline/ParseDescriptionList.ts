import { TextConsumer } from '../TextConsumer'
import { DescriptionListItem } from '../../SyntaxNodes/DescriptionListItem'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { DescriptionTerm } from '../../SyntaxNodes/DescriptionTerm'
import { Description } from '../../SyntaxNodes/Description'
import { getInlineNodes } from '../Inline/GetInlineNodes'
import { getOutlineNodes } from './GetOutlineNodes'
import { isLineFancyOutlineConvention } from './IsLineFancyOutlineConvention'
import { optional, startsWith, either, NON_BLANK, BLANK, INDENT, STREAK } from './Patterns'
import { last } from '../CollectionHelpers'
import { OutlineParser, OutlineParserArgs, } from './OutlineParser'
import { getRemainingLinesOfListItem } from './GetRemainingLinesOfListItem'

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
  const listItemNodes: DescriptionListItem[] = []

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
    const descriptionLines: string[] = []

    const hasDescription = consumer.consumeLine({
      pattern: INDENTED_PATTERN,
      if: (line) => !BLANK_PATTERN.test(line),
      then: (line) => descriptionLines.push(line.replace(INDENTED_PATTERN, ''))
    })

    if (!hasDescription) {
      break
    }
    
    let isListTerminated = false
    
    getRemainingLinesOfListItem({
      text: consumer.remainingText(),
      then: (lines, lengthParsed, shouldTerminateList) => {
        descriptionLines.push(...lines)
        consumer.skip(lengthParsed)
        isListTerminated = shouldTerminateList
      }
    })

    const termNodes =
      terms.map((term) => new DescriptionTerm(getInlineNodes(term)))

    const descriptionNode =
      new Description(
        getOutlineNodes(descriptionLines.join('\n')))

    listItemNodes.push(new DescriptionListItem(termNodes, descriptionNode))
    
    if (isListTerminated) {
      break
    }
  }

  if (!listItemNodes.length) {
    return false
  }

  args.then([new DescriptionListNode(listItemNodes)], consumer.lengthConsumed())
  return true
}