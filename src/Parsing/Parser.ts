import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { ParseResult } from './ParseResult'

export interface Parser {
  (text: string, parentNode?: SyntaxNode): ParseResult
}