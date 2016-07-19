import { LineConsumer } from './LineConsumer'
import { INDENTED_PATTERN, BLANK_PATTERN } from '../Patterns'


// Indented blocks include indented and blank lines.
export function getIndentedBlock(
  args: {
    lines: string[],
    then: (lines: string[], countLinesConsumed: number, hasMultipleTrailingBlankLines: boolean) => void
  }
): void {
  const consumer = new LineConsumer(args.lines)
  const lines: string[] = []
  let contentLineCount = 0

  while (!consumer.done()) {
    const wasLineBlank = consumer.consume({
      linePattern: BLANK_PATTERN,
      then: line => {
        lines.push(line)
      }
    })

    if (wasLineBlank) {
      // The line was blank, so we don't yet know whether the author intended for the line to be
      // included in the indented block or not (it could be trailin). We'll move onto the next
      // line without updating `contentLineCount`.
      continue
    }

    const wasLineIndented = consumer.consume({
      linePattern: INDENTED_PATTERN,
      then: line => {
        lines.push(line)
        contentLineCount = lines.length
      }
    })

    if (!wasLineIndented) {
      // The current line is neither blank nor indented. We're done!
      break
    }
  }

  if (!lines.length) {
    return
  }

  const countTrailingBlankLines = lines.length - contentLineCount
  const hasMultipleTrailingBlankLines = countTrailingBlankLines >= 2

  // If an indented block has a single trailing blank line, its trailing line is consumed but not
  // included as content.
  //
  // If there are two or more trailing blank lines, those trailing blank lines are neither consumed
  // nor included. They're instead left behind for another outline convention to deal with.
  let countLinesConsumed =
    hasMultipleTrailingBlankLines
      ? contentLineCount
      : lines.length

  const resultLines = lines
    .slice(0, contentLineCount)
    .map(line => line.replace(INDENTED_PATTERN, ''))

  args.then(resultLines, countLinesConsumed, hasMultipleTrailingBlankLines)
}
