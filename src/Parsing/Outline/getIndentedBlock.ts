import { LineConsumer } from './LineConsumer'
import { INDENTED_PATTERN, BLANK_PATTERN } from '../../Patterns'


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
  const markupLineConsumer = new LineConsumer(args.lines)
  const indentedLines: string[] = []
  let indentedBlockLineCount = 0

  while (!markupLineConsumer.done()) {
    const blankLineResult =
      markupLineConsumer.consumeLineIfMatches(BLANK_PATTERN)

    if (blankLineResult) {
      // The line was blank, so we don't yet know whether the author intended for the line to be
      // included in the indented block or not (it could be trailin). We'll move onto the next
      // line without updating `contentLineCount`.
      continue
    }

    const indentedLineResult =
      markupLineConsumer.consumeLineIfMatches(INDENTED_PATTERN)

    if (!indentedLineResult) {
      // The current line is neither blank nor indented. We're done!
      break
    }

    indentedLines.push(indentedLineResult.line)
    indentedBlockLineCount = indentedLines.length
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
