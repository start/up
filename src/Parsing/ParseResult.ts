import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNodeType } from '../SyntaxNodes/RichSyntaxNode'

export class ParseResult {
  public success = true
  
  constructor(public nodes: SyntaxNode[], public countCharsParsed: number) { }
  
  wrappedIn(RichSyntaxNodeType: RichSyntaxNodeType): ParseResult {
    return new ParseResult(
      [new RichSyntaxNodeType(this.nodes)]
      , this.countCharsParsed
    );
  }
}