import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { ParseResult } from './ParseResult'
import { parseInline } from './InlineParser'

export function parseInline(text: string, parentNode: SyntaxNode): ParseResult {
  if (!text) {
    return new ParseResult([], 0)
  }
  
  return new ParseResult(
    [new PlainTextNode(text)],
    text.length
  )
}