import { TextConsumer } from '../TextConsumer'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { getOutlineNodes } from './GetOutlineNodes'
import { startsWith, optional, INLINE_WHITESPACE_CHAR } from './Patterns'
import { OutlineParser, OutlineParserArgs, } from './OutlineParser'

const QUOTE_DELIMITER_PATTERN = new RegExp(
  startsWith('>' + optional(INLINE_WHITESPACE_CHAR))
)

// Consecutive lines starting with "> " form a blockquote. Blockquotes can contain any convention,
// even other blockquotes! They're like mini-documents.
export function parseBlockquote(args: OutlineParserArgs): boolean {
  const consumer = new TextConsumer(args.text)
  const blockquoteLines: string[] = []

  // Collect all consecutive blockquoted lines
  while (consumer.consumeLine({
    pattern: QUOTE_DELIMITER_PATTERN,
    then: (line) => blockquoteLines.push(line.replace(QUOTE_DELIMITER_PATTERN, ''))
  })) { }

  if (!blockquoteLines.length) {
    return false
  }

  const blockquoteContent = blockquoteLines.join('\n')

  args.then([new BlockquoteNode(getOutlineNodes(blockquoteContent))], consumer.lengthConsumed())
  return true
}
