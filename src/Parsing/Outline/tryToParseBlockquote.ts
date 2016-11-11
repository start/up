import { LineConsumer } from './LineConsumer'
import { Blockquote } from '../../SyntaxNodes/Blockquote'
import { getOutlineSyntaxNodes } from './getOutlineSyntaxNodes'
import { patternStartingWith, optional } from '../../PatternHelpers'
import { ANY_OPTIONAL_WHITESPACE } from '../../PatternPieces'
import { OutlineParserArgs } from './OutlineParserArgs'


// Consecutive lines starting with "> " form a blockquote. Blockquotes can contain any outline
// convention, even other blockquotes.
//
// The space directly following the '>' can be omitted, but if it exists, it is considered part of
// the delimiter (and is removed before parsing the blockquoted contents).
export function tryToParseBlockquote(args: OutlineParserArgs): boolean {
  const markupLineConsumer = new LineConsumer(args.markupLines)
  const blockquotedLines: string[] = []

  // Collect all consecutive blockquoted lines
  while (true) {
    const result = markupLineConsumer.consumeLineIfMatches(BLOCKQUOTE_DELIMITER_PATTERN)

    if (!result) {
      break
    }

    blockquotedLines.push(result.line.replace(BLOCKQUOTE_DELIMITER_PATTERN, ''))
  }

  if (!blockquotedLines.length) {
    return false
  }

  const { sourceLineNumber, headingLeveler } = args

  const blockquoteChildren = getOutlineSyntaxNodes({
    markupLines: blockquotedLines,
    sourceLineNumber,
    headingLeveler,
    settings: args.settings
  })

  args.then(
    [new Blockquote(blockquoteChildren)],
    markupLineConsumer.countLinesConsumed)

  return true
}


const BLOCKQUOTE_DELIMITER_PATTERN =
  patternStartingWith(ANY_OPTIONAL_WHITESPACE + '>' + optional(' '))
