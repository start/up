import { LineConsumer } from './LineConsumer'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { getInlineNodes } from '../Inline/getInlineNodes'
import { getOutlineNodes } from './getOutlineNodes'
import { isLineFancyOutlineConvention } from './isLineFancyOutlineConvention'
import { INDENTED_PATTERN, BLANK_PATTERN, NON_BLANK_PATTERN } from '../Patterns'
import { OutlineParserArgs } from './OutlineParserArgs'
import { getIndentedBlock } from './getIndentedBlock'


// Description lists are collections of terms and descriptions.
//
// Terms are left-aligned; descriptions are indented and directly follow the corresponding terms.
// Descriptions can contain any outline convention, including other description lists!
//  
// Multiple terms can be associated with a single description. Each collection of terms and their
// associated description comprise a single description list item.
//     
// Description list items don't need to be separated by blank lines, but when they are, 2 or more
// blank lines terminates the whole description list, not just the list item. 
export function tryToParseDescriptionList(args: OutlineParserArgs): boolean {
  const markupLineConsumer = new LineConsumer(args.markupLines)
  const listItems: DescriptionListNode.Item[] = []
  let countLinesConsumed = 0

  while (!markupLineConsumer.done()) {
    let markupPerTerm: string[] = []

    // First, we collect every term for the next description.
    while (!markupLineConsumer.done()) {
      const isTerm = markupLineConsumer.consume({
        linePattern: NON_BLANK_PATTERN,
        if: line => !INDENTED_PATTERN.test(line) && !isLineFancyOutlineConvention(line, args.config),
        thenBeforeConsumingLine: line => {
          markupPerTerm.push(line)
        }
      })

      if (!isTerm) {
        break
      }
    }

    if (!markupPerTerm.length) {
      break
    }

    const descriptionLines: string[] = []

    const sourceLineNumberForDescription =
      args.sourceLineNumber + markupLineConsumer.countLinesConsumed

    // Let's parse the desription's first line.
    const hasDescription = markupLineConsumer.consume({
      linePattern: INDENTED_PATTERN,
      if: line => !BLANK_PATTERN.test(line),
      thenBeforeConsumingLine: line => {
        descriptionLines.push(line.replace(INDENTED_PATTERN, ''))
      }
    })

    if (!hasDescription) {
      // There wasn't a description, so the latest "terms" we found were actually just regular lines
      // not part of any description list.
      break
    }

    let shouldTerminateList = false

    // Let's collect the rest of the lines in the description (if there are any)  
    getIndentedBlock({
      lines: markupLineConsumer.remaining(),
      then: (indentedLines, countLinesConsumedByIndentedBlock, hasMultipleTrailingBlankLines) => {
        descriptionLines.push(...indentedLines)
        markupLineConsumer.skipLines(countLinesConsumedByIndentedBlock)
        shouldTerminateList = hasMultipleTrailingBlankLines
      }
    })

    // Alright, we have our description! Let's update our length parsed accordingly.
    countLinesConsumed = markupLineConsumer.countLinesConsumed

    const terms =
      markupPerTerm.map(term => new DescriptionListNode.Item.Term(getInlineNodes(term, args.config)))

    const description =
      new DescriptionListNode.Item.Description(
        getOutlineNodes({
          markupLines: descriptionLines,
          sourceLineNumber: sourceLineNumberForDescription,
          headingLeveler: args.headingLeveler,
          config: args.config
        }))

    listItems.push(new DescriptionListNode.Item(terms, description))

    if (shouldTerminateList) {
      break
    }
  }

  if (!listItems.length) {
    return false
  }

  args.then(
    [new DescriptionListNode(listItems)],
    countLinesConsumed)

  return true
}
