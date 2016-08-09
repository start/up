import { LineConsumer } from './LineConsumer'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { getOutlineNodes } from './getOutlineNodes'
import { HeadingLeveler } from './HeadingLeveler'
import { patternStartingWith, optional } from '../PatternHelpers'
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
  while (markupLineConsumer.consume({
    linePattern: BLOCKQUOTE_DELIMITER_PATTERN,
    then: line => {
      blockquotedLines.push(line.replace(BLOCKQUOTE_DELIMITER_PATTERN, ''))
    }
  })) { }

  if (!blockquotedLines.length) {
    return false
  }

  // Within blockquotes, heading levels are reset
  const headingLeveler = new HeadingLeveler()

  const blockquote =
    new BlockquoteNode(
      getOutlineNodes({
        markupLines: blockquotedLines,
        sourceLineNumber: args.sourceLineNumber + markupLineConsumer.countLinesConsumed,
        headingLeveler,
        config: args.config
      }))

  args.then([blockquote], markupLineConsumer.countLinesConsumed)
  return true
}


const BLOCKQUOTE_DELIMITER_PATTERN =
  patternStartingWith('>' + optional(' '))
