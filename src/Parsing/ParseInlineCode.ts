import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'
import { InlineCodeNode } from '../SyntaxNodes/InlineCodeNode'
import { ParseResult } from './ParseResult'
import { parse } from './Parse'

export function parseInlineCode(text: string, parentNode: RichSyntaxNode): ParseResult {
  return parse(text, parentNode, {
    startsWith: '`',
    endsWith: '`'
  }).wrappedIn(InlineCodeNode)
}