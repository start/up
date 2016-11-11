import { LineConsumer } from './LineConsumer'
import { RevealableBlock } from '../../SyntaxNodes/RevealableBlock'
import { getOutlineSyntaxNodes } from './getOutlineSyntaxNodes'
import { getIndentedBlock } from './getIndentedBlock'
import { solelyAndIgnoringCapitalization, escapeForRegex, optional, either } from '../../PatternHelpers'
import { OutlineParserArgs } from './OutlineParserArgs'


// A revealable block consists of a "label line" (a keyword followed by an optional colon) followed by
// an indented block.
//
// A revealable block can contain any outline convention, and its label's keyword is case-insensitive. 
export function tryToParseRevealableBlock(args: OutlineParserArgs): boolean {
  const markupLineConsumer = new LineConsumer(args.markupLines)
  const { keywords } = args.settings

  const labelLinePattern =
    solelyAndIgnoringCapitalization(
      either(...keywords.revealable.map(escapeForRegex)) + optional(':'))

  if (!markupLineConsumer.consumeLineIfMatches({ linePattern: labelLinePattern })) {
    return false
  }

  const contentLines: string[] = []

  getIndentedBlock({
    lines: markupLineConsumer.remaining(),
    then: (indentedLines, countLinesConsumed) => {
      contentLines.push(...indentedLines)
      markupLineConsumer.skipLines(countLinesConsumed)
    }
  })

  if (!contentLines.length) {
    return false
  }

  const children = getOutlineSyntaxNodes({
    markupLines: contentLines,
    // We add 1 because of the label line.
    sourceLineNumber: args.sourceLineNumber + 1,
    headingLeveler: args.headingLeveler,
    settings: args.settings
  })

  args.then([new RevealableBlock(children)], markupLineConsumer.countLinesConsumed)
  return true
}
