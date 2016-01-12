import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNodeType } from '../SyntaxNodes/RichSyntaxNode'

export class ParseResult {
  constructor(public nodes: SyntaxNode[], public countCharsConsumed: number) { }
  
  wrappedIn(RichSyntaxNodeType: RichSyntaxNodeType): ParseResult {
    return new ParseResult(
      [new RichSyntaxNodeType(this.nodes)]
      , this.countCharsConsumed
    );
  }
  
  success(): boolean {
    return true
  }
}