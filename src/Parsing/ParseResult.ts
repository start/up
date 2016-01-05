import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNodeType } from '../SyntaxNodes/RichSyntaxNode'

export abstract class ParseResult {
  abstract success(): boolean;
  nodes: SyntaxNode[]
  countCharsConsumed: number
  
  abstract wrappedIn(RichSyntaxNodeType: RichSyntaxNodeType): ParseResult
}