import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'

export class ParseResult {
  constructor(public nodes: SyntaxNode[], public countCharsConsumed: number)  { }
  
  success(): boolean {
    return true
  }
}