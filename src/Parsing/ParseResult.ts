import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNodeType } from '../SyntaxNodes/RichSyntaxNode'

export abstract class ParseResult {
  nodes: SyntaxNode[]
  countCharsConsumed: number
  
  abstract wrappedIn(RichSyntaxNodeType: RichSyntaxNodeType): ParseResult
  
  success(): boolean {
    return !!this.countCharsConsumed
  }
}