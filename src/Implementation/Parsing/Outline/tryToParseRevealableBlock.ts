import { either, escapeForRegex, optional, solelyAndIgnoringCapitalization } from '../../PatternHelpers'
import { RevealableBlock } from '../../SyntaxNodes/RevealableBlock'
import { getIndentedBlock } from './getIndentedBlock'
import { getOutlineSyntaxNodes } from './getOutlineSyntaxNodes'
import { LineConsumer } from './LineConsumer'
import { OutlineParser } from './OutlineParser'


// A revealable block consists of a "label line" (a keyword followed by an optional colon) followed by
// an indented block.
//
// A revealable block can contain any outline convention, and its label's keyword is case-insensitive.
export function tryToParseRevealableBlock(args: OutlineParser.Args): OutlineParser.Result {
  const markupLineConsumer = new LineConsumer(args.markupLines)
  const { keywords } = args.settings

  const labelLinePattern =
    solelyAndIgnoringCapitalization(
      either(...keywords.revealable().map(escapeForRegex)) + optional(':'))

  if (!markupLineConsumer.consumeLineIfMatches(labelLinePattern)) {
    return null
  }

  const indentedBlockResult = getIndentedBlock(markupLineConsumer.remaining())

  const contentLines: string[] = []

  if (indentedBlockResult) {
    contentLines.push(...indentedBlockResult.lines)
    markupLineConsumer.advance(indentedBlockResult.countLinesConsumed)
  }

  if (!contentLines.length) {
    return null
  }

  const children = getOutlineSyntaxNodes({
    markupLines: contentLines,
    // We add 1 because of the label line.
    sourceLineNumber: args.sourceLineNumber + 1,
    headingLeveler: args.headingLeveler,
    settings: args.settings
  })

  return {
    parsedNodes: [new RevealableBlock(children)],
    countLinesConsumed: markupLineConsumer.countLinesConsumed()
  }
}
