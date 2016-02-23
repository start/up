import { TextConsumer } from '../TextConsumer'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { parseInline } from '../Inline/ParseInline'
import { getOutlineNodes } from './GetOutlineNodes'
import { startsWith, optional, INLINE_WHITESPACE_CHAR } from './Patterns'
import { ParseContext, OnParse } from '../Parser'

const QUOTE_DELIMITER_PATTERN = new RegExp(
  startsWith('>' + optional(INLINE_WHITESPACE_CHAR))
)

// Consecutive lines starting with "> " form a blockquote. Blockquotes can contain any convention,
// even other blockquotes! They're like mini-documents.
export function parseBlockquote(text: string, parseArgs: ParseContext, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)
  const blockquoteLines: string[] = []

  // Collect all consecutive blockquoted lines
  while (consumer.consumeLineIfMatches({
    pattern: QUOTE_DELIMITER_PATTERN,
    then: (line) => blockquoteLines.push(line.replace(QUOTE_DELIMITER_PATTERN, ''))
  })) { }

  if (!blockquoteLines.length) {
    return false
  }
  
  const blockquoteContent = blockquoteLines.join('\n')

    onParse(
      [new BlockquoteNode(getOutlineNodes(blockquoteContent))],
      consumer.lengthConsumed(),
      parseArgs.parentNode)
}
