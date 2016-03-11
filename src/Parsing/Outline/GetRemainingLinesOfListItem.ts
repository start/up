import { TextConsumer } from '../TextConsumer'
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
  const consumer = new TextConsumer(args.text)
  const lines: string[] = []

  let countLinesIncluded = 0
  let lengthParsed = 0

  while (!consumer.done()) {
    const wasLineBlank = consumer.consumeLine({
      pattern: BLANK_PATTERN,
      then: (line) => lines.push(line)
    })

    if (wasLineBlank) {
      // The line was blank, so we don't know whether we should include it yet.  
      continue
    }

    const wasLineIndented = consumer.consumeLine({
      pattern: INDENTED_PATTERN,
      then: (line) => lines.push(line)
    })

    if (wasLineIndented) {
      // The line was both non-blank and indented, so we know we need to include this line.
      countLinesIncluded = lines.length
      lengthParsed = consumer.lengthConsumed()
      continue
    } else {
      // The line was neither blank nor indented. Bail!
      break
    }
  }

  if (!lines.length) {
    return false
  }

  const countLinesOfTrailingWhitespace = lines.length - countLinesIncluded
  const shouldTerminateList = countLinesOfTrailingWhitespace >= 2

  if (!shouldTerminateList) {
    // If we aren't terminating the list, we should  return everything we consumed
    countLinesIncluded = lines.length
    lengthParsed = consumer.lengthConsumed()
  }

  const resultLines = lines
    .slice(0, countLinesIncluded)
    .map((line) => line.replace(INDENTED_PATTERN, ''))

  args.then(resultLines, lengthParsed, shouldTerminateList)

  return true
}
