import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNodeType } from '../SyntaxNodes/RichSyntaxNode'

export class ParseResult {
  constructor(public nodes: SyntaxNode[], public countCharsParsed: number) { }
  
  wrappedIn(RichSyntaxNodeType: RichSyntaxNodeType): ParseResult {
    return new ParseResult(
      [new RichSyntaxNodeType(this.nodes)]
      , this.countCharsParsed
    );
  }
  
  success(): boolean {
    return true
  }
}