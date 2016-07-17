import { LineConsumer } from './LineConsumer'
import { INDENTED_PATTERN, BLANK_PATTERN } from '../Patterns'


// Indented blocks include all indented and blank lines.
//
// However, if an indented block has 2 or more trailing blank lines, those trailing blank lines
// are not included.
//
// Returns false if no lines could be included.
export function getIndentedBlock(
  args: {
    lines: string[],
    then: (lines: string[], lcountLinesConsumed: number, hasMultipleTrailingBlankLines: boolean) => void
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
      // included in the indented block or not. We'll move onto the next line without updating
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
  const hasMultipleTrailingBlankLines = countTrailingBlankLines >= 2

  if (!hasMultipleTrailingBlankLines) {
    // If there aren't multiple trailing blank lines, we go ahead and include everything we consumed.
    countLinesIncluded = allConsumedLines.length
  }

  const resultLines = allConsumedLines
    .slice(0, countLinesIncluded)
    .map(line => line.replace(INDENTED_PATTERN, ''))

  args.then(resultLines, countLinesIncluded, hasMultipleTrailingBlankLines)
}
