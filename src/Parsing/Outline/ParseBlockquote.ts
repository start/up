import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { parseInline } from '../Inline/ParseInline'
import { parseOutline } from './ParseOutline'
import { startsWith, optional, INLINE_WHITESPACE_CHAR } from './Patterns'
import { ParseArgs, OnParse } from '../Parser'

const QUOTE_DELIMITER_PATTERN = new RegExp(
  startsWith('>' + optional(INLINE_WHITESPACE_CHAR))
)

// Consecutive lines starting with "> " form a blockquote. Blockquotes can contain any convention,
// even other blockquotes! They're like mini-documents.
export function parseBlockquote(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)

  const lines: string[] = []

  // Collect all consecutive lines starting with "> "
  while (consumer.consumeLineIf(QUOTE_DELIMITER_PATTERN, (line) => { lines.push(line) })) { }

  if (!lines.length) {
    return false
  }
  
  // Strip "> " from each line, then stick them all back together. See where this is going?
  let blockquoteContent = lines
    .map((line) => line.replace(QUOTE_DELIMITER_PATTERN, ''))
    .join('\n')

  // Parse the contents of the blockquote as though it's a mini-document. Because it is!
  return parseOutline(blockquoteContent, { parentNode: new BlockquoteNode(parseArgs.parentNode) },
    (contentNodes, countCharsParsed, blockquoteNode) => {
      blockquoteNode.addChildren(contentNodes)
      onParse([blockquoteNode], consumer.countRawCharsConsumed(), parseArgs.parentNode)
    })
}
