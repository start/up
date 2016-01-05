import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNodeType } from '../SyntaxNodes/RichSyntaxNode'
import { ParseResult } from './ParseResult'

export class SuccessfulParseResult extends ParseResult {
  constructor(public nodes: SyntaxNode[], public countCharsConsumed: number) {
    super()
  }
  
  wrappedIn(RichSyntaxNodeType: RichSyntaxNodeType): ParseResult {
    return new SuccessfulParseResult(
      [new RichSyntaxNodeType(this.nodes)]
      , this.countCharsConsumed
    );
  }
  
  success(): boolean {
    return true
  }
}