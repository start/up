import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'

export class ParseResult {
  constructor(public nodes: SyntaxNode[])  { }
  
  success(): boolean {
    return true
  }
}