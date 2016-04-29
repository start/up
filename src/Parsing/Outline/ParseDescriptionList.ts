import { OutlineTextConsumer } from './OutlineTextConsumer'
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
// Multiple terms can be associated with a single description.
export function parseDescriptionList(args: OutlineParserArgs): boolean {
  const consumer = new OutlineTextConsumer(args.text)
  const listItemNodes: DescriptionListItem[] = []
  let lengthParsed = 0

  while (!consumer.done()) {
    let rawTerms: string[] = []

    // First, we collect every term for the next description
    while (!consumer.done()) {
      const isTerm = consumer.consumeLine({
        pattern: NON_BLANK_PATTERN,
        if: (line) => !INDENTED_PATTERN.test(line) && !isLineFancyOutlineConvention(line, args.config),
        then: (line) => rawTerms.push(line)
      })

      if (!isTerm) {
        break
      }
    }

    if (!rawTerms.length) {
      break
    }

    const descriptionLines: string[] = []

    // Let's parse the desription's first line
    const hasDescription = consumer.consumeLine({
      pattern: INDENTED_PATTERN,
      if: (line) => !BLANK_PATTERN.test(line),
      then: (line) => descriptionLines.push(line.replace(INDENTED_PATTERN, ''))
    })

    if (!hasDescription) {
      // There wasn't a description, so our "term" was just a regular paragraph following the list.
      break
    }
    
    let isListTerminated = false
    
    getRemainingLinesOfListItem({
      text: consumer.remainingText(),
      then: (lines, lengthParsed, shouldTerminateList) => {
        descriptionLines.push(...lines)
        consumer.advance(lengthParsed)
        isListTerminated = shouldTerminateList
      }
    })
    
    // Alright, we have our description! Let's update our length parsed accordingly .
    lengthParsed = consumer.lengthConsumed()

    const terms =
      rawTerms.map((term) => new DescriptionTerm(getInlineNodes(term)))
    
    const description =
      new Description(getOutlineNodes(descriptionLines.join('\n'), args.config))

    listItemNodes.push(new DescriptionListItem(terms, description))
    
    if (isListTerminated) {
      break
    }
  }

  if (!listItemNodes.length) {
    return false
  }

  args.then([new DescriptionListNode(listItemNodes)], lengthParsed)
  return true
}
