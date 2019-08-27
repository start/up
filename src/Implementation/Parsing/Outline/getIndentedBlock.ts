import { BLANK_PATTERN, INDENTED_PATTERN } from '../../Patterns'
import { LineConsumer } from './LineConsumer'


// Indented blocks include indented and blank lines.
export function getIndentedBlock(lines: string[]): IndentedBlockResult | null {
  const markupLineConsumer = new LineConsumer(lines)
  const indentedLines: string[] = []
  let countLinesWithoutTrailingBlankLines = 0

  while (!markupLineConsumer.done) {
    const blankLineResult =
      markupLineConsumer.consumeLineIfMatches(BLANK_PATTERN)

    if (blankLineResult) {
      // The line was blank, so we don't yet know whether the author intended for the line to be
      // included in the indented block or not (it could be trailing). We'll move onto the next
      // line without updating `indentedBlockLineCount`.
      indentedLines.push(blankLineResult.line)
      continue
    }

    const indentedLineResult =
      markupLineConsumer.consumeLineIfMatches(INDENTED_PATTERN)

    if (!indentedLineResult) {
      // The current line is neither blank nor indented. We're done!
      break
    }

    indentedLines.push(indentedLineResult.line)
    countLinesWithoutTrailingBlankLines = indentedLines.length
  }

  if (!indentedLines.length) {
    return null
  }

  const countTrailingBlankLines = (indentedLines.length - countLinesWithoutTrailingBlankLines)
  const hasMultipleTrailingBlankLines = (countTrailingBlankLines >= 2)

  // If an indented block has a single trailing blank line, its trailing line is consumed but not
  // included as content.
  //
  // If there are two or more trailing blank lines, those trailing blank lines are neither consumed
  // nor included. They're instead left behind for another outline convention to deal with.
  const countLinesConsumed =
    hasMultipleTrailingBlankLines
      ? countLinesWithoutTrailingBlankLines
      : indentedLines.length

  const linesWithoutIndentation = indentedLines
    .slice(0, countLinesWithoutTrailingBlankLines)
    .map(line => line.replace(INDENTED_PATTERN, ''))

  return {
    lines: linesWithoutIndentation,
    countLinesConsumed,
    hasMultipleTrailingBlankLines
  }
}


export interface IndentedBlockResult {
  lines: string[]
  countLinesConsumed: number
  hasMultipleTrailingBlankLines: boolean
}
