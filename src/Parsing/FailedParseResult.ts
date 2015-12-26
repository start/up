import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { ParseResult } from './ParseResult'

export class FailedParseResult extends ParseResult {
  constructor() {
    super(null, 0, null)
  }
  
  success(): boolean {
    return false
  }
}