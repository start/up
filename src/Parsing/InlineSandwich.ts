import { SyntaxNode, SyntaxNodeType } from '../SyntaxNodes/SyntaxNode'

export class InlineSandwich {
  constructor(public SyntaxNodeType: SyntaxNodeType, public bun: string, public closingBun = bun) { }
}