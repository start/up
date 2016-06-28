import { LineConsumer } from './LineConsumer'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { getOutlineNodes } from './getOutlineNodes'
import { HeadingLeveler } from './HeadingLeveler'
import { regExpStartingWith, regExpEndingWith, optional, atLeast, capture } from '../PatternHelpers'
import { INLINE_WHITESPACE_CHAR } from '../PatternPieces'
import { INPUT_LINE_BREAK } from '../Strings'
import { OutlineParserArgs } from './OutlineParserArgs'


// Consecutive lines starting with "> " form a blockquote. Blockquotes can contain any convention,
// even other blockquotes! They're like mini-documents.
export function tryToParseBlockquote(args: OutlineParserArgs): boolean {
  const consumer = new LineConsumer(args.text)
  const rawBlockquoteLines: string[] = []

  // Collect all consecutive blockquoted lines
  while (consumer.consume({
    linePattern: ALL_BLOCKQUOTE_DELIMITERS_PATTERN,
    then: line => rawBlockquoteLines.push(line.replace(FIRST_BLOCKQUOTE_DELIMITER_PATTERN, ''))
  })) { }

  if (!rawBlockquoteLines.length) {
    return false
  }

  const rawBlockquotedContent =
    rawBlockquoteLines.join(INPUT_LINE_BREAK)

  // Within blockquotes, heading levels are reset
  const headingLeveler = new HeadingLeveler()

  const blockquote =
    new BlockquoteNode(
      getOutlineNodes(rawBlockquotedContent, headingLeveler, args.config))

  args.then([blockquote], consumer.textIndex)

  return true
}


const BLOCKQUOTE_DELIMITER =
  '>' + optional(INLINE_WHITESPACE_CHAR)

const ALL_BLOCKQUOTE_DELIMITERS_PATTERN =
  regExpStartingWith(
    capture(atLeast(1, BLOCKQUOTE_DELIMITER)))

const FIRST_BLOCKQUOTE_DELIMITER_PATTERN =
  regExpStartingWith(BLOCKQUOTE_DELIMITER)