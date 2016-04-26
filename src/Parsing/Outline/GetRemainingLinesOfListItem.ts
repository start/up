import { OutlineTextConsumer } from './OutlineTextConsumer'
import { OrderedListNode, ListOrder } from '../../SyntaxNodes/OrderedListNode'
import { OrderedListItem } from '../../SyntaxNodes/OrderedListItem'
import { getOutlineNodes } from './GetOutlineNodes'
import { optional, startsWith, either, capture, INLINE_WHITESPACE_CHAR, BLANK, INDENT, INTEGER, STREAK } from './Patterns'
import { last } from '../CollectionHelpers'

const STREAK_PATTERN = new RegExp(
  STREAK
)

const BLANK_PATTERN = new RegExp(
  BLANK
)

const INDENTED_PATTERN = new RegExp(
  startsWith(INDENT)
)
interface Args {
  text: string,
  then: OnSuccess
}

interface OnSuccess {
  (lines: string[], lengthParsed: number, shouldTerminateList: boolean): void
}

// All indented and/or blank lines should be included in a list item.
//
// However, if there are 2 or more trailing blank lines, they should *not* be included. Instead,
// they indicate the end of the list.
export function getRemainingLinesOfListItem(args: Args): boolean {
  const consumer = new OutlineTextConsumer(args.text)
  const lines: string[] = []

  let countLinesIncluded = 0
  let lengthParsed = 0

  while (!consumer.done()) {
    const wasLineBlank = consumer.consumeLine({
      pattern: BLANK_PATTERN,
      then: (line) => lines.push(line)
    })

    if (wasLineBlank) {
      // The line was blank, so we don't know whether we should include it yet
      continue
    }

    const wasLineIndented = consumer.consumeLine({
      pattern: INDENTED_PATTERN,
      then: (line) => lines.push(line)
    })

    if (!wasLineIndented) {
      // The line was neither blank nor indented. Bail!
      break
    }

    // The line was indented and non-blank, so we know we need to include it
    countLinesIncluded = lines.length
    lengthParsed = consumer.lengthConsumed()
  }

  if (!lines.length) {
    return false
  }

  const countTrailingBlankLines = lines.length - countLinesIncluded
  const shouldTerminateList = countTrailingBlankLines >= 2

  if (!shouldTerminateList) {
    // If we aren't terminating the list, we should return everything we consumed
    countLinesIncluded = lines.length
    lengthParsed = consumer.lengthConsumed()
  }

  const resultLines = lines
    .slice(0, countLinesIncluded)
    .map((line) => line.replace(INDENTED_PATTERN, ''))

  args.then(resultLines, lengthParsed, shouldTerminateList)
  return true
}
