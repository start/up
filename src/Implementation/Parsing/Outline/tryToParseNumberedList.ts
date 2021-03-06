import { anyCharFrom, capture, either, escapeForRegex, oneOrMore, optional, patternStartingWith } from '../../PatternHelpers'
import { DIGIT, INLINE_WHITESPACE_CHAR } from '../../PatternPieces'
import { DIVIDER_STREAK_PATTERN } from '../../Patterns'
import { NumberedList } from '../../SyntaxNodes/NumberedList'
import { getIndentedBlock } from './getIndentedBlock'
import { getOutlineSyntaxNodes } from './getOutlineSyntaxNodes'
import { LineConsumer } from './LineConsumer'
import { OutlineParser } from './OutlineParser'


// Numbered lists are simply collections of numbered list items.
//
// List items can contain any outline convention, even other lists!  In list items with
// multiple lines, all subsequent lines are indented.
//
// List items don't need to be separated by blank lines, but when they are, 2 or more
// blank lines terminates the whole list.
export function tryToParseNumberedList(args: OutlineParser.Args): OutlineParser.Result {
  const markupLineConsumer = new LineConsumer(args.markupLines)
  const unparsedListItems: UnparsedListItem[] = []

  while (!markupLineConsumer.done()) {
    const countLinesConsumedBeforeListItem = markupLineConsumer.countLinesConsumed()

    const numberedLineResult =
      markupLineConsumer.consumeLineIfMatches(LINE_WITH_NUMERIC_BULLET_PATTERN, {
        andIf: result => !DIVIDER_STREAK_PATTERN.test(result.line)
      })

    if (!numberedLineResult) {
      break
    }

    const [bullet] = numberedLineResult.captures

    const unparsedListItem =
      new UnparsedListItem({
        bullet,
        firstLineOfMarkup: numberedLineResult.line.replace(LINE_WITH_NUMERIC_BULLET_PATTERN, ''),
        sourceLineNumber: args.sourceLineNumber + countLinesConsumedBeforeListItem
      })


    // Let's collect the rest of the lines in the current list item (if there are any).
    const indentedBlockResult =
      getIndentedBlock(markupLineConsumer.remaining())

    let shouldTerminateList = false

    if (indentedBlockResult) {
      unparsedListItem.markupLines.push(...indentedBlockResult.lines)
      markupLineConsumer.advance(indentedBlockResult.countLinesConsumed)
      shouldTerminateList = indentedBlockResult.hasMultipleTrailingBlankLines
    }

    unparsedListItems.push(unparsedListItem)

    if (shouldTerminateList) {
      break
    }
  }

  if (!isANumberedList(unparsedListItems)) {
    return null
  }

  const listItems = unparsedListItems.map(unparsedListItem => {
    const itemChildren = getOutlineSyntaxNodes({
      markupLines: unparsedListItem.markupLines,
      sourceLineNumber: unparsedListItem.sourceLineNumber,
      headingLeveler: args.headingLeveler,
      settings: args.settings
    })

    const ordinal = getExplicitOrdinal(unparsedListItem)

    return new NumberedList.Item(itemChildren, { ordinal })
  })

  return {
    parsedNodes: [new NumberedList(listItems)],
    countLinesConsumed: markupLineConsumer.countLinesConsumed()
  }
}


class UnparsedListItem {
  bullet: string
  markupLines: string[]
  sourceLineNumber: number

  constructor(
    args: {
      bullet: string,
      firstLineOfMarkup: string,
      sourceLineNumber: number
    }
  ) {
    this.bullet = args.bullet
    this.markupLines = [args.firstLineOfMarkup]
    this.sourceLineNumber = args.sourceLineNumber
  }
}


function isANumberedList(unparsedListItems: UnparsedListItem[]): boolean {
  const { length } = unparsedListItems

  return (
    // If there aren't any list items, we're not dealing with a numbered list.
    length > 0
    && (
      // There are five ways to bullet a numbered list:
      //
      // 1. An integer followed by a period
      // 2) An integer followed by a closing parenthesis
      // # A number sign (this and all other bullets must be followed by a space)
      // #. A number sign followed by a period
      // #) A number sign followed by a closing parenthesis
      //
      // The first one is potentially unclear. Look at the following paragraph:
      //
      //   1783. Not a good year for Great Britain.
      //
      // Did the author intend the paragraph be a numbered list with a single item? Probably not.
      //
      // Therefore, if the first bullet style is used, we require more than one list item.
      length > 1
      || !BULLETED_BY_INTEGER_FOLLOWED_BY_PERIOD_PATTERN.test(unparsedListItems[0].bullet)))
}


function getExplicitOrdinal(unparsedListItem: UnparsedListItem): number | undefined {
  const result = FIRST_INTEGER_PATTERN.exec(unparsedListItem.bullet)

  return result
    ? parseInt(result[0], 10)
    : undefined
}


export const INTEGER =
  optional(escapeForRegex('-')) + oneOrMore(DIGIT)

const NUMERIC_BULLET =
  either(
    '#',
    capture(either(INTEGER, '#') + anyCharFrom('.', ')')))

const LINE_WITH_NUMERIC_BULLET_PATTERN =
  patternStartingWith(
    optional(' ') + NUMERIC_BULLET + INLINE_WHITESPACE_CHAR)

const BULLETED_BY_INTEGER_FOLLOWED_BY_PERIOD_PATTERN =
  patternStartingWith(INTEGER + '\\.')

const FIRST_INTEGER_PATTERN =
  new RegExp(INTEGER)
