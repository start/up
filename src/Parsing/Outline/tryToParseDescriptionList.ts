import { LineConsumer } from './LineConsumer'
import { DescriptionListItem } from '../../SyntaxNodes/DescriptionListItem'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { DescriptionTerm } from '../../SyntaxNodes/DescriptionTerm'
import { Description } from '../../SyntaxNodes/Description'
import { getInlineNodes } from '../Inline/getInlineNodes'
import { getOutlineNodes } from './getOutlineNodes'
import { isLineFancyOutlineConvention } from './isLineFancyOutlineConvention'
import { INDENTED_PATTERN, BLANK_PATTERN, NON_BLANK_PATTERN } from '../Patterns'
import { INPUT_LINE_BREAK } from '../Strings'
import { OutlineParserArgs } from './OutlineParserArgs'
import { getRemainingLinesOfListItem } from './getRemainingLinesOfListItem'


// Description lists are collections of terms and descriptions.
//
// Terms are left-aligned; descriptions are indented and directly follow the corresponding terms.
//
// Multiple terms can be associated with a single description.
export function tryToParseDescriptionList(args: OutlineParserArgs): boolean {
  const consumer = new LineConsumer(args.lines)
  const listItems: DescriptionListItem[] = []
  let lengthParsed = 0

  while (!consumer.done()) {
    let rawTerms: string[] = []

    // First, we collect every term for the next description.
    while (!consumer.done()) {
      const isTerm = consumer.consume({
        linePattern: NON_BLANK_PATTERN,
        if: line => !INDENTED_PATTERN.test(line) && !isLineFancyOutlineConvention(line, args.config),
        then: line => rawTerms.push(line)
      })

      if (!isTerm) {
        break
      }
    }

    if (!rawTerms.length) {
      break
    }

    const descriptionLines: string[] = []

    // Let's parse the desription's first line.
    const hasDescription = consumer.consume({
      linePattern: INDENTED_PATTERN,
      if: line => !BLANK_PATTERN.test(line),
      then: line => descriptionLines.push(line.replace(INDENTED_PATTERN, ''))
    })

    if (!hasDescription) {
      // There wasn't a description, so the latest "terms" we found were actually just regular lines
      // not part of any description list.
      break
    }

    let isListTerminated = false

    getRemainingLinesOfListItem({
      lines: consumer.getRemainingLines(),
      then: (lines, countLinesConsumed, shouldTerminateList) => {
        descriptionLines.push(...lines)
        consumer.skipLines(countLinesConsumed)
        isListTerminated = shouldTerminateList
      }
    })

    // Alright, we have our description! Let's update our length parsed accordingly.
    lengthParsed = consumer.countLinesConsumed

    const terms =
      rawTerms.map(term => new DescriptionTerm(getInlineNodes(term, args.config)))

    const description =
      new Description(
        getOutlineNodes(descriptionLines, args.headingLeveler, args.config))

    listItems.push(new DescriptionListItem(terms, description))

    if (isListTerminated) {
      break
    }
  }

  if (!listItems.length) {
    return false
  }

  args.then([new DescriptionListNode(listItems)], lengthParsed)
  return true
}
