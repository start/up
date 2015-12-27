import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { ParseResult } from './ParseResult'

export class FailedParseResult extends ParseResult {
  constructor() {
    super([], 0, null)
  }
  
  success(): boolean {
    return false
  }
}