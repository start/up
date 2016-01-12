import { ParseResult } from './ParseResult'
import { RichSyntaxNodeType } from '../SyntaxNodes/RichSyntaxNode'

export class FailedParseResult extends ParseResult {
  constructor() {
    super([], 0)
  }
  
  wrappedIn(RichSyntaxNodeType: RichSyntaxNodeType): ParseResult {
    return this
  }
}