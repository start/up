import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'

export class ParseResult {
  constructor(public nodes: SyntaxNode[], public countCharsConsumed: number, public parentNode: SyntaxNode)  { }
  
  success(): boolean {
    return true
  }
}