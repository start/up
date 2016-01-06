import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNodeType } from '../SyntaxNodes/RichSyntaxNode'
import { ParseResult } from './ParseResult'

export class CompletedParseResult extends ParseResult {
  constructor(public nodes: SyntaxNode[], public countCharsConsumed: number) {
    super()
  }
  
  wrappedIn(RichSyntaxNodeType: RichSyntaxNodeType): ParseResult {
    return new CompletedParseResult(
      [new RichSyntaxNodeType(this.nodes)]
      , this.countCharsConsumed
    );
  }
}