import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { parseInline } from '../Inline/ParseInline'
import { parseOutline } from './ParseOutline'
import { lineStartingWith, optional, WHITESPACE_CHAR } from './Patterns'
import { ParseArgs, OnParse } from '../Parser'

const QUOTE_DELIMITER = new RegExp(
  lineStartingWith('>' + optional(WHITESPACE_CHAR))
)

// Consecutive lines starting with "> " form a blockquote. Blockquotes can contain any convention,
// even other blockquotes! They're like mini-documents.
export function parseBlockquote(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)

  const lines: string[] = []

  // Collect all consecutive lines starting with "> "
  while (consumer.consumeLineIf(QUOTE_DELIMITER, (line) => { lines.push(line) })) { }

  if (!lines.length) {
    return false
  }
  
  // Strip "> " from each line, then stick them all back together. See where this is going?
  let blockquoteContent = lines
    .map((line) => line.replace(QUOTE_DELIMITER, ''))
    .join('\n')

  // Parse the contents of the blockquote as though it's a mini-document. Because it is!
  return parseOutline(blockquoteContent, { parentNode: new LineBlockNode(parseArgs.parentNode) },
    (contentNodes, countCharsParsed, blockquoteNode) => {
      blockquoteNode.addChildren(contentNodes)
      onParse([blockquoteNode], consumer.countCharsAdvanced(), parseArgs.parentNode)
    })
}
