import { LineConsumer } from './LineConsumer'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { getOutlineNodes } from './getOutlineNodes'
import { HeadingLeveler } from './HeadingLeveler'
import { regExpStartingWith, optional } from '../PatternHelpers'
import { OutlineParserArgs } from './OutlineParserArgs'


// Consecutive lines starting with "> " form a blockquote. Blockquotes can contain any outline
// convention, even other blockquotes.
//
// The space directly following the '>' can be omitted, but if it exists, it is considered part of
// the delimiter (and is removed before parsing the blockquoted contents).
export function tryToParseBlockquote(args: OutlineParserArgs): boolean {
  const consumer = new LineConsumer(args.lines)
  const blockquotedLines: string[] = []

  // Collect all consecutive blockquoted lines
  while (consumer.tryToConsume({
    linePattern: BLOCKQUOTE_DELIMITER_PATTERN,
    then: line => blockquotedLines.push(line.replace(BLOCKQUOTE_DELIMITER_PATTERN, ''))
  })) { }

  if (!blockquotedLines.length) {
    return false
  }

  // Within blockquotes, heading levels are reset
  const headingLeveler = new HeadingLeveler()

  const blockquote =
    new BlockquoteNode(
      getOutlineNodes(blockquotedLines, headingLeveler, args.config))

  args.then([blockquote], consumer.countLinesConsumed)
  return true
}

const BLOCKQUOTE_DELIMITER_PATTERN =
  regExpStartingWith('>' + optional(' '))
