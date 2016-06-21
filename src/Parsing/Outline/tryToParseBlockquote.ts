import { LineConsumer } from './LineConsumer'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { getOutlineNodes } from './getOutlineNodes'
import { HeadingLeveler } from './HeadingLeveler'
import { regExpStartingWith, regExpEndingWith, optional, atLeast, capture } from '../PatternHelpers'
import { INLINE_WHITESPACE_CHAR } from '../PatternPieces'
import { OutlineParserArgs } from './OutlineParserArgs'


// Consecutive lines starting with "> " form a blockquote. Blockquotes can contain any convention,
// even other blockquotes! They're like mini-documents.
export function tryToParseBlockquote(args: OutlineParserArgs): boolean {
  const consumer = new LineConsumer(args.text)
  const rawBlockquoteLines: string[] = []

  // Collect all consecutive blockquoted lines
  while (consumer.consume({
    linePattern: ALL_BLOCKQUOTE_DELIMITERS_PATTERN,
    if: isLineProperlyBlockquoted,
    then: line => rawBlockquoteLines.push(line.replace(FIRST_BLOCKQUOTE_DELIMITER_PATTERN, ''))
  })) { }

  if (!rawBlockquoteLines.length) {
    return false
  }

  const rawBlockquoteContent = rawBlockquoteLines.join('\n')

  // Within blockquotes, heading levels are reset
  const headingLeveler = new HeadingLeveler()

  args.then([
    new BlockquoteNode(getOutlineNodes(rawBlockquoteContent, headingLeveler, args.config))],
    consumer.textIndex)

  return true
}

function isLineProperlyBlockquoted(line: string, delimiters: string): boolean {
  // On a given line, only the final blockquote delimiter must be followed by a space. Therefore:
  // 
  // >>> This is a nested blockquote.
  //
  // And...
  //
  // > > > This is a nested blockquote.
  //
  // If the line being quoted is otherwise blank (i.e. the line is nothing but blockquote delimiters),
  // the final delimiter isn't required to have a trailing space. For example:
  //
  // > The delimiter on the next line does not need a trailing space.
  // >
  // > Oh, on a side note, tabs can substitute for trailing spaces.
  return TRAILING_SPACE_PATTERN.test(delimiters) || (line === delimiters)
}


const BLOCKQUOTE_DELIMITER =
  '>' + optional(INLINE_WHITESPACE_CHAR)

const ALL_BLOCKQUOTE_DELIMITERS_PATTERN =
  regExpStartingWith(
    capture(atLeast(1, BLOCKQUOTE_DELIMITER)))

const FIRST_BLOCKQUOTE_DELIMITER_PATTERN =
  regExpStartingWith(BLOCKQUOTE_DELIMITER)

const TRAILING_SPACE_PATTERN =
  regExpEndingWith(INLINE_WHITESPACE_CHAR)
