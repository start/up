import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { ParseResult } from './ParseResult'
import { parseEither } from './ParseEither'

export function parseInline(text: string, parentNode: RichSyntaxNode): ParseResult {
  return parseEither(text, parentNode, [])
}