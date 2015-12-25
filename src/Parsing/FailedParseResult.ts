import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { ParseResult } from './ParseResult'

export class FailedParseResult extends ParseResult {
  constructor() {
    super(null)
  }
  
  success(): boolean {
    return false
  }
}