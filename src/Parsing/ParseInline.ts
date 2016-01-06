import { RichSyntaxNodeType } from '../SyntaxNodes/RichSyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { ParseResult } from './ParseResult'
import { Parser } from './Parser'
import { parse } from './Parse'
import { InlineCodeNode } from '../SyntaxNodes/InlineCodeNode'
import { EmphasisNode } from '../SyntaxNodes/EmphasisNode'
import { StressNode } from '../SyntaxNodes/StressNode'
import { RevisionDeletionNode } from '../SyntaxNodes/RevisionDeletionNode'
import { RevisionInsertionNode } from '../SyntaxNodes/RevisionInsertionNode'
import { SpoilerNode } from '../SyntaxNodes/SpoilerNode'
import { sandwichParser } from './SandwichParser'

export function parseInline(text: string, parentNode: RichSyntaxNode, exitBefore?: string): ParseResult {
  
  function sandwichParser(RichSyntaxNodeType: RichSyntaxNodeType, openingBun: string, closingBun: string, insideParser?: Parser): Parser {
    
    return function parseSandwich(text: string, parentNode?: RichSyntaxNode): ParseResult {
      return parse(text, parentNode, {
        parsers: (insideParser ? [insideParser]: null),
        startsWith: openingBun,
        endsWith: closingBun
      }, exitBefore).wrappedIn(RichSyntaxNodeType)
    }
  }

  return parse(text, parentNode, {
    parsers: [
      sandwichParser(InlineCodeNode, '`', '`'),
      sandwichParser(StressNode, '**', '**', parseInline),
      sandwichParser(EmphasisNode, '*', '*', parseInline),
      sandwichParser(RevisionInsertionNode, '++', '++', parseInline),
      sandwichParser(RevisionDeletionNode, '~~', '~~', parseInline),
      sandwichParser(SpoilerNode, '[<_<]', '[>_>]', parseInline),
    ]
  }, exitBefore)
}