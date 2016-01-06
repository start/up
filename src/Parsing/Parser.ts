import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'
import { ParseResult } from './ParseResult'

export interface Parser {
  (text: string, parentNode?: RichSyntaxNode, exitBefore?: string): ParseResult
}
