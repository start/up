import { BLANK_PATTERN, INDENTED_PATTERN, NON_BLANK_PATTERN } from '../../Patterns'
import { DescriptionList } from '../../SyntaxNodes/DescriptionList'
import { getInlineSyntaxNodes } from '../Inline/getInlineSyntaxNodes'
import { getIndentedBlock } from './getIndentedBlock'
import { getOutlineSyntaxNodes } from './getOutlineSyntaxNodes'
import { isLineFancyOutlineConvention } from './isLineFancyOutlineConvention'
import { LineConsumer } from './LineConsumer'
import { OutlineParser } from './OutlineParser'


// Description lists are collections of subjects and descriptions.
//
// Subjects are left-aligned; descriptions are indented and follow the corresponding subjects
// (preceded by an optional leading blank line). Descriptions can contain any outline convention,
// including other description lists.
//
// Multiple subjects can be associated with a single description. Each collection of subjects
// and their corresponding description comprise a single description list item.
//
// Description list items don't need to be separated by blank lines, but when they are, 2 or more
// trailing blank lines terminates the whole description list, not just the list item.
//
// TODO: Better handle edge-case of lines consisting solely of escaped whitespace.
export function tryToParseDescriptionList(args: OutlineParser.Args): OutlineParser.Result {
  const markupLineConsumer = new LineConsumer(args.markupLines)
  const listItems: DescriptionList.Item[] = []
  let countLinesConsumed = 0

  while (!markupLineConsumer.done()) {
    const markupLinesForSubjects: string[] = []

    // First, let's collect the subjects described by the upcoming description.
    while (!markupLineConsumer.done()) {
      const subjectResult =
        markupLineConsumer.consumeLineIfMatches(NON_BLANK_PATTERN, {
          andIf: result => !INDENTED_PATTERN.test(result.line) && !isLineFancyOutlineConvention(result.line, args.settings)
        })

      if (!subjectResult) {
        break
      }

      markupLinesForSubjects.push(subjectResult.line)
    }

    if (!markupLinesForSubjects.length) {
      break
    }

    // Alright! We have our subjects! Next up is the subjects' description.
    //
    // First, let's skip the optional leading blank line.
    markupLineConsumer.consumeLineIfMatches(BLANK_PATTERN)

    const sourceLineNumberForDescription =
      args.sourceLineNumber + markupLineConsumer.countLinesConsumed()

    // Let's parse the description's first line.
    const descriptionResult =
      markupLineConsumer.consumeLineIfMatches(INDENTED_PATTERN, {
        andIf: result => !BLANK_PATTERN.test(result.line)
      })

    if (!descriptionResult) {
      // There wasn't a description, so the latest "subjects" we found were actually just regular
      // lines not part of any description list.
      break
    }

    const descriptionLines = [descriptionResult.line.replace(INDENTED_PATTERN, '')]

    // Let's collect the rest of the lines in the description (if there are any).
    const indentedBlockResult = getIndentedBlock(markupLineConsumer.remaining())

    let shouldTerminateList = false

    if (indentedBlockResult) {
      descriptionLines.push(...indentedBlockResult.lines)
      markupLineConsumer.advance(indentedBlockResult.countLinesConsumed)
      shouldTerminateList = indentedBlockResult.hasMultipleTrailingBlankLines
    }

    // Alright, we have our description! Let's update our number of lines consumed.
    countLinesConsumed = markupLineConsumer.countLinesConsumed()

    const subjects =
      markupLinesForSubjects.map(subject =>
        new DescriptionList.Item.Subject(getInlineSyntaxNodes(subject, args.settings)))

    const description =
      new DescriptionList.Item.Description(
        getOutlineSyntaxNodes({
          markupLines: descriptionLines,
          sourceLineNumber: sourceLineNumberForDescription,
          headingLeveler: args.headingLeveler,
          settings: args.settings
        }))

    listItems.push(new DescriptionList.Item(subjects, description))

    if (shouldTerminateList) {
      break
    }
  }

  if (!listItems.length) {
    return null
  }

  return {
    parsedNodes: [new DescriptionList(listItems)],
    countLinesConsumed
  }
}
