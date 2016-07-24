import { LineConsumer } from './LineConsumer'
import { INDENTED_PATTERN, BLANK_PATTERN } from '../Patterns'


// Indented blocks include indented and blank lines.
export function getIndentedBlock(
  args: {
    lines: string[],
    then: (
      indentedLines: string[],
      countLinesConsumed: number,
      hasMultipleTrailingBlankLines: boolean
    ) => void
  }
): void {
  const lineConsumer = new LineConsumer(args.lines)
  const indentedLines: string[] = []
  let indentedBlockLineCount = 0

  while (!lineConsumer.done()) {
    const wasLineBlank = lineConsumer.consume({
      linePattern: BLANK_PATTERN,
      then: line => {
        indentedLines.push(line)
      }
    })

    if (wasLineBlank) {
      // The line was blank, so we don't yet know whether the author intended for the line to be
      // included in the indented block or not (it could be trailin). We'll move onto the next
      // line without updating `contentLineCount`.
      continue
    }

    const wasLineIndented = lineConsumer.consume({
      linePattern: INDENTED_PATTERN,
      then: line => {
        indentedLines.push(line)
        indentedBlockLineCount = indentedLines.length
      }
    })

    if (!wasLineIndented) {
      // The current line is neither blank nor indented. We're done!
      break
    }
  }

  if (!indentedLines.length) {
    return
  }

  const countTrailingBlankLines = indentedLines.length - indentedBlockLineCount
  const hasMultipleTrailingBlankLines = countTrailingBlankLines >= 2

  // If an indented block has a single trailing blank line, its trailing line is consumed but not
  // included as content.
  //
  // If there are two or more trailing blank lines, those trailing blank lines are neither consumed
  // nor included. They're instead left behind for another outline convention to deal with.
  let countLinesConsumed =
    hasMultipleTrailingBlankLines
      ? indentedBlockLineCount
      : indentedLines.length

  const indentedBlockLines = indentedLines
    .slice(0, indentedBlockLineCount)
    .map(line => line.replace(INDENTED_PATTERN, ''))

  args.then(indentedBlockLines, countLinesConsumed, hasMultipleTrailingBlankLines)
}
