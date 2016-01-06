import { RichSyntaxNodeType } from '../SyntaxNodes/RichSyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { ParseResult } from './ParseResult'
import { Parser } from './Parser'
import { parse } from './Parse'
import { InlineCodeNode } from '../SyntaxNodes/InlineCodeNode'
import { EmphasisNode } from '../SyntaxNodes/EmphasisNode'
import { sandwichParser } from './SandwichParser'

export function parseInline(text: string, parentNode: RichSyntaxNode, exitBefore?: string): ParseResult {
  
  function sandwichParser(RichSyntaxNodeType: RichSyntaxNodeType, openingBun: string, closingBun: string, parser?: Parser): Parser {
    
    return function parseSandwich(text: string, parentNode?: RichSyntaxNode): ParseResult {
      return parse(text, parentNode, {
        parsers: (parser ? [parser]: null),
        startsWith: openingBun,
        endsWith: closingBun
      }, exitBefore).wrappedIn(RichSyntaxNodeType)
    }
  }

  return parse(text, parentNode, {
    parsers: [
      sandwichParser(InlineCodeNode, '`', '`'),
      sandwichParser(EmphasisNode, '*', '*', parseInline)
    ]
  }, exitBefore)
}