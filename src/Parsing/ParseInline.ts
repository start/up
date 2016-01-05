import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { ParseResult } from './ParseResult'
import { parse } from './Parse'
import { parseInlineCode } from './ParseInlineCode'

export function parseInline(text: string, parentNode: RichSyntaxNode): ParseResult {
  console.log(text)
  return parse(text, parentNode, {
    parsers: [parseInlineCode]
  })
}