import { TextConsumer } from '../TextConsumer'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { BLANK } from './Patterns'
import { ParseArgs, OnParse } from '../Parser'

const BLANK_PATTERN = new RegExp(
  BLANK
) 

// Outline conventions (e.g. paragraphs, headings) are normally separated by 1 or 2 consecutive blank lines.
// The blank lines themselves don't produce any syntax nodes.
//
// However, 3 or more consecutive blank lines indicates meaningful, deliberate separation between sections.
// We represent that separation with a SectionSeparatorNode.
export function parseBlankLineSeparation(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)


  let count = 0

  while (consumer.consumeLineIfMatches({pattern: BLANK_PATTERN})) {
    count += 1
  }
  
  // If there are no blank lines, we can't say we parsed anything. Bail!  
  if (!count) {
    return false
  }

  const COUNT_BLANK_LINES_IN_SECTION_SEPARATOR = 3

  const nodes = (
    count >= COUNT_BLANK_LINES_IN_SECTION_SEPARATOR
      ? [new SectionSeparatorNode()]
      : []
  )

  onParse(nodes, consumer.countCharsConsumed(), parseArgs.parentNode)
  return true
}
