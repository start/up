import { RichSyntaxNodeType } from '../SyntaxNodes/RichSyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'
import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { InlineCodeNode } from '../SyntaxNodes/InlineCodeNode'
import { ParseResult } from './ParseResult'
import { Parser } from './Parser'
import { parse } from './Parse'

export function sandwichParser(RichSyntaxNodeType: RichSyntaxNodeType, openingBun: string, closingBun: string, parser?: Parser): Parser {
  
  return function parseSandwich(text: string, parentNode?: RichSyntaxNode): ParseResult {
    return parse(text, parentNode, {
      parsers: (parser ? [parser]: null),
      startsWith: openingBun,
      endsWith: closingBun
    }).wrappedIn(RichSyntaxNodeType)
  }
}