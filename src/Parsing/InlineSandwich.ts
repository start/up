import { SyntaxNodeType } from './SyntaxNodeType'

export class InlineSandwich {
  constructor(public SyntaxNodeType: SyntaxNodeType, public bun: string, public closingBun = bun) { }
}