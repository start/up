import { LineConsumer } from './LineConsumer'
import { DescriptionList } from '../../SyntaxNodes/DescriptionList'
import { getInlineSyntaxNodes } from '../Inline/getInlineSyntaxNodes'
import { getOutlineSyntaxNodes } from './getOutlineSyntaxNodes'
import { isLineFancyOutlineConvention } from './isLineFancyOutlineConvention'
import { INDENTED_PATTERN, BLANK_PATTERN, NON_BLANK_PATTERN } from '../../Patterns'
import { OutlineParserArgs } from './OutlineParserArgs'
import { getIndentedBlock } from './getIndentedBlock'


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
export function tryToParseDescriptionList(args: OutlineParserArgs): boolean {
  const markupLineConsumer = new LineConsumer(args.markupLines)
  const listItems: DescriptionList.Item[] = []
  let countLinesConsumed = 0

  while (!markupLineConsumer.done()) {
    let markupLinesForSubjects: string[] = []

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
      args.sourceLineNumber + markupLineConsumer.countLinesConsumed

    // Let's parse the desription's first line.
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
    let shouldTerminateList = false

    // Let's collect the rest of the lines in the description (if there are any).
    getIndentedBlock({
      lines: markupLineConsumer.remaining(),
      then: (indentedLines, countLinesConsumedByIndentedBlock, hasMultipleTrailingBlankLines) => {
        descriptionLines.push(...indentedLines)
        markupLineConsumer.skipLines(countLinesConsumedByIndentedBlock)
        shouldTerminateList = hasMultipleTrailingBlankLines
      }
    })

    // Alright, we have our description! Let's update our number of lines consumed.
    countLinesConsumed = markupLineConsumer.countLinesConsumed

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
    return false
  }

  args.then(
    [new DescriptionList(listItems)],
    countLinesConsumed)

  return true
}
