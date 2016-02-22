import { TextConsumer } from '../TextConsumer'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { parseInline } from '../Inline/ParseInline'
import { parseOutline } from './ParseOutline'
import { startsWith, optional, INLINE_WHITESPACE_CHAR } from './Patterns'
import { ParseContextArgs, OnParse } from '../Parser'

const QUOTE_DELIMITER_PATTERN = new RegExp(
  startsWith('>' + optional(INLINE_WHITESPACE_CHAR))
)

// Consecutive lines starting with "> " form a blockquote. Blockquotes can contain any convention,
// even other blockquotes! They're like mini-documents.
export function parseBlockquote(text: string, parseArgs: ParseContextArgs, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)
  const lines: string[] = []

  // Collect all consecutive blockquoted lines
  while (consumer.consumeLineIfMatches({
    pattern: QUOTE_DELIMITER_PATTERN,
    then: (line) => lines.push(line.replace(QUOTE_DELIMITER_PATTERN, ''))
  })) { }

  if (!lines.length) {
    return false
  }
  
  const blockquoteContent = lines.join('\n')

  // Parse the contents of the blockquote as though it's a mini-document. Because it is!
  return parseOutline(blockquoteContent, { parentNode: new BlockquoteNode(parseArgs.parentNode) },
    (contentNodes, countCharsParsed, blockquoteNode) => {
      blockquoteNode.addChildren(contentNodes)
      onParse([blockquoteNode], consumer.countCharsConsumed(), parseArgs.parentNode)
    })
}
