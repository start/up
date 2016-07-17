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
  const allConsumedLines: string[] = []
  let countLinesIncluded = 0

  while (!consumer.done()) {
    const wasLineBlank = consumer.consume({
      linePattern: BLANK_PATTERN,
      then: line => {
        allConsumedLines.push(line)
      }
    })

    if (wasLineBlank) {
      // The line was blank, so we don't yet know whether the author intended for the line to be
      // included in the list item or not. We'll move onto the next line without updating
      // `countLinesIncluded`.
      continue
    }

    const wasLineIndented = consumer.consume({
      linePattern: INDENTED_PATTERN,
      then: line => {
        allConsumedLines.push(line)
        countLinesIncluded = allConsumedLines.length        
      }
    })

    if (!wasLineIndented) {
      // The current line is neither blank nor indented. We're done!
      break
    }
  }

  if (!allConsumedLines.length) {
    return
  }

  const countTrailingBlankLines = allConsumedLines.length - countLinesIncluded
  const shouldTerminateList = countTrailingBlankLines >= 2

  if (!shouldTerminateList) {
    // If we aren't terminating the list, we should include everything we consumed.
    countLinesIncluded = allConsumedLines.length
  }

  const resultLines = allConsumedLines
    .slice(0, countLinesIncluded)
    .map(line => line.replace(INDENTED_PATTERN, ''))

  args.then(resultLines, countLinesIncluded, shouldTerminateList)
}
