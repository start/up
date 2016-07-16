import { LineConsumer } from './LineConsumer'
import { INDENTED_PATTERN, BLANK_PATTERN } from '../Patterns'


// All indented and/or blank lines should be included in a list item.
//
// However, if there are 2 or more trailing blank lines, they should *not* be included. Instead,
// they indicate the end of the whole list.
//
// Returns false if no lines could be included.
export function getRemainingLinesOfListItem(
  args: {
    lines: string[],
    then: (lines: string[], lcountLinesConsumed: number, shouldTerminateList: boolean) => void
  }
): void {
  const consumer = new LineConsumer(args.lines)
  const lines: string[] = []

  let countLinesIncluded = 0
  let lcountLinesConsumed = 0

  while (!consumer.done()) {
    const wasLineBlank = consumer.consume({
      linePattern: BLANK_PATTERN,
      then: line => {
        lines.push(line)
      }
    })

    if (wasLineBlank) {
      // The line was blank, so we don't know whether we should include it yet
      continue
    }

    const wasLineIndented = consumer.consume({
      linePattern: INDENTED_PATTERN,
      then: line => {
        lines.push(line)
      }
    })

    if (!wasLineIndented) {
      // The line was neither blank nor indented. Bail!
      break
    }

    // The line was indented and non-blank, so we know we need to include it
    countLinesIncluded = lines.length
    lcountLinesConsumed = consumer.countLinesConsumed
  }

  if (!lines.length) {
    return
  }

  const countTrailingBlankLines = lines.length - countLinesIncluded
  const shouldTerminateList = countTrailingBlankLines >= 2

  if (!shouldTerminateList) {
    // If we aren't terminating the list, we should return everything we consumed
    countLinesIncluded = lines.length
    lcountLinesConsumed = consumer.countLinesConsumed
  }

  const resultLines = lines
    .slice(0, countLinesIncluded)
    .map(line => line.replace(INDENTED_PATTERN, ''))

  args.then(resultLines, lcountLinesConsumed, shouldTerminateList)
}
