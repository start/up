import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { ParseResult } from './ParseResult'
import { parse } from './Parse'

export function parseInlineCode(text: string, parentNode: RichSyntaxNode): ParseResult {
  return parse(text, parentNode, {
    startsWith: '`',
    endsWith: '`'
  })
}