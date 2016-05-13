import { LineConsumer } from './LineConsumer'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { getOutlineNodes } from './GetOutlineNodes'
import { HeadingLeveler } from './HeadingLeveler'
import { startsWith, endsWith, optional, atLeast, capture, INLINE_WHITESPACE_CHAR, NON_WHITESPACE_CHAR } from '../Patterns'
import { OutlineParserArgs } from './OutlineParser'

const BLOCKQUOTE_DELIMITER = '>' + optional(INLINE_WHITESPACE_CHAR)

const ALL_BLOCKQUOTE_DELIMITERS_PATTERN = new RegExp(
  capture(
    startsWith((atLeast(1, BLOCKQUOTE_DELIMITER)))
  )
)

const FIRST_BLOCKQUOTE_DELIMITER_PATTERN = new RegExp(
  startsWith(BLOCKQUOTE_DELIMITER)
)

const TRAILING_SPACE_PATTERN = new RegExp(
  endsWith(INLINE_WHITESPACE_CHAR)
)


// Consecutive lines starting with "> " form a blockquote. Blockquotes can contain any convention,
// even other blockquotes! They're like mini-documents.
export function parseBlockquote(args: OutlineParserArgs): boolean {
  const consumer = new LineConsumer(args.text)
  const blockquoteLines: string[] = []

  // Collect all consecutive blockquoted lines
  while (consumer.consumeLine({
    pattern: ALL_BLOCKQUOTE_DELIMITERS_PATTERN,
    if: isLineProperlyBlockquoted,
    then: (line) => blockquoteLines.push(line.replace(FIRST_BLOCKQUOTE_DELIMITER_PATTERN, ''))
  })) { }

  if (!blockquoteLines.length) {
    return false
  }

  const blockquoteContent = blockquoteLines.join('\n')

  // Within blockquotes, heading levels are reset
  const headingLeveler = new HeadingLeveler()
  
  args.then([
    new BlockquoteNode(getOutlineNodes(blockquoteContent, headingLeveler, args.config))],
    consumer.lengthConsumed())
    
  return true
}

function isLineProperlyBlockquoted(line: string, delimiters: string): boolean {
  // On a given line, only the final blockquote delimiter is required to have a trailing space.  If the line
  // being quoted is otherwise blank, the final delimiter isn't required to have a trailing space. For example:
  //
  // > The delimiter on the next line does not need a trailing space.
  // >
  // > Oh, on a side note, tabs can substitute for trailing spaces.
  //
  // In other words, he final blockquote delimiter must not be followed by a non-whitespace character.
    
  return TRAILING_SPACE_PATTERN.test(delimiters) || (line === delimiters)
}
