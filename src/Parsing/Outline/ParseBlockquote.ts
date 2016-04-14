import { TextConsumer } from '../TextConsumer'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { getOutlineNodes } from './GetOutlineNodes'
import { startsWith, optional, atLeast, INLINE_WHITESPACE_CHAR } from './Patterns'
import { OutlineParser, OutlineParserArgs, } from './OutlineParser'

const BLOCKQUOTE_DELIMITER = '>' + optional(INLINE_WHITESPACE_CHAR)

// On a given line, only the final blockquote delimiter is required to have a trailing space.  
const BLOCKQUOTED_TEXT_PATTERN = new RegExp(
  startsWith(atLeast(1, BLOCKQUOTE_DELIMITER) + INLINE_WHITESPACE_CHAR)
)

const FIRST_BLOCKQUOTE_DELIMITER_PATTERN = new RegExp(
  startsWith(BLOCKQUOTE_DELIMITER)
)

// Consecutive lines starting with "> " form a blockquote. Blockquotes can contain any convention,
// even other blockquotes! They're like mini-documents.
export function parseBlockquote(args: OutlineParserArgs): boolean {
  const consumer = new TextConsumer(args.text)
  const blockquoteLines: string[] = []

  // Collect all consecutive blockquoted lines
  while (consumer.consumeLine({
    pattern: BLOCKQUOTED_TEXT_PATTERN,
    then: (line) => blockquoteLines.push(line.replace(FIRST_BLOCKQUOTE_DELIMITER_PATTERN, ''))
  })) { }

  if (!blockquoteLines.length) {
    return false
  }

  const blockquoteContent = blockquoteLines.join('\n')

  args.then([new BlockquoteNode(getOutlineNodes(blockquoteContent))], consumer.lengthConsumed())
  return true
}
