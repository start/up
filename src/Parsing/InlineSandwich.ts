import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { SyntaxNodeType } from './SyntaxNodeType'

export class InlineSandwich {
  constructor(public bun: string, public SyntaxNodeType: SyntaxNodeType) { }
}