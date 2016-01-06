import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { ParseResult } from './ParseResult'
import { parse } from './Parse'
import { InlineCodeNode } from '../SyntaxNodes/InlineCodeNode'
import { EmphasisNode } from '../SyntaxNodes/EmphasisNode'
import { sandwichParser } from './SandwichParser'

export function parseInline(text: string, parentNode: RichSyntaxNode, exitBefore?: string): ParseResult {
  
  return parse(text, parentNode, {
    parsers: [
      sandwichParser(InlineCodeNode, '`', '`'),
      sandwichParser(EmphasisNode, '*', '*')
    ]
  })
}