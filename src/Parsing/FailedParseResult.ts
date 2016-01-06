import { ParseResult } from './ParseResult'
import { RichSyntaxNodeType } from '../SyntaxNodes/RichSyntaxNode'

export class FailedParseResult extends ParseResult {
  constructor() {
    super()
  }
  
  wrappedIn(RichSyntaxNodeType: RichSyntaxNodeType): ParseResult {
    return this
  }
}