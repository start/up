import { optional, patternStartingWith } from '../../PatternHelpers'
import { ANY_OPTIONAL_WHITESPACE } from '../../PatternPieces'
import { Blockquote } from '../../SyntaxNodes/Blockquote'
import { getOutlineSyntaxNodes } from './getOutlineSyntaxNodes'
import { LineConsumer } from './LineConsumer'
import { OutlineParser } from './OutlineParser'


// Consecutive lines starting with "> " form a blockquote. Blockquotes can contain any outline
// convention, even other blockquotes.
//
// The space directly following the '>' can be omitted, but if it exists, it is considered part of
// the delimiter (and is removed before parsing the blockquoted contents).
export function tryToParseBlockquote(args: OutlineParser.Args): OutlineParser.Result {
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
    return null
  }

  const { sourceLineNumber, headingLeveler } = args

  const blockquoteChildren = getOutlineSyntaxNodes({
    markupLines: blockquotedLines,
    sourceLineNumber,
    headingLeveler,
    settings: args.settings
  })

  return {
    parsedNodes: [new Blockquote(blockquoteChildren)],
    countLinesConsumed: markupLineConsumer.countLinesConsumed()
  }
}


const BLOCKQUOTE_DELIMITER_PATTERN =
  patternStartingWith(ANY_OPTIONAL_WHITESPACE + '>' + optional(' '))
