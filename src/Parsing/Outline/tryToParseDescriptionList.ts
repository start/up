import { LineConsumer } from './LineConsumer'
import { DescriptionListItem } from '../../SyntaxNodes/DescriptionListItem'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { DescriptionTerm } from '../../SyntaxNodes/DescriptionTerm'
import { Description } from '../../SyntaxNodes/Description'
import { getInlineNodes } from '../Inline/getInlineNodes'
import { getOutlineNodes } from './getOutlineNodes'
import { isLineFancyOutlineConvention } from './isLineFancyOutlineConvention'
import { optional, regExpStartingWith, either } from '../PatternHelpers'
import { INDENTED_PATTERN, DIVIDER_STREAK_PATTERN, BLANK_PATTERN, NON_BLANK_PATTERN } from '../Patterns'
import { OutlineParserArgs } from './OutlineParserArgs'
import { getRemainingLinesOfListItem } from './getRemainingLinesOfListItem'


// Description lists are collections of terms and descriptions.
//
// Terms are left-aligned; descriptions are indented and directly follow the corresponding terms.
//
// Multiple terms can be associated with a single description.
export function tryToParseDescriptionList(args: OutlineParserArgs): boolean {
  const consumer = new LineConsumer(args.text)
  const listItems: DescriptionListItem[] = []
  let lengthParsed = 0

  while (!consumer.reachedEndOfText()) {
    let rawTerms: string[] = []

    // First, we collect every term for the next description.
    while (!consumer.reachedEndOfText()) {
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

    const rawDescriptionLines: string[] = []

    // Let's parse the desription's first line.
    const hasDescription = consumer.consume({
      linePattern: INDENTED_PATTERN,
      if: line => !BLANK_PATTERN.test(line),
      then: line => rawDescriptionLines.push(line.replace(INDENTED_PATTERN, ''))
    })

    if (!hasDescription) {
      // There wasn't a description, so the latest "terms" we found were actually just regular lines
      // not part of any description list.
      break
    }
    
    let isListTerminated = false
    
    getRemainingLinesOfListItem({
      text: consumer.remainingText,
      then: (lines, lengthParsed, shouldTerminateList) => {
        rawDescriptionLines.push(...lines)
        consumer.advanceTextIndex(lengthParsed)
        isListTerminated = shouldTerminateList
      }
    })
    
    // Alright, we have our description! Let's update our length parsed accordingly.
    lengthParsed = consumer.textIndex

    const terms =
      rawTerms.map(term => new DescriptionTerm(getInlineNodes(term, args.config)))
    
    const rawDescription = rawDescriptionLines.join('\n')
    
    const description =
      new Description(getOutlineNodes(rawDescription, args.headingLeveler, args.config))

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
