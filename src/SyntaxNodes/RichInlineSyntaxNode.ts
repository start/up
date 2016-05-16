import { InlineSyntaxNode } from '../SyntaxNodes/InlineSyntaxNode'

export abstract class RichInlineSyntaxNode extends InlineSyntaxNode {
  constructor(public children: InlineSyntaxNode[]) {
    super()
  }
  
  richInlineSyntaxNode(): void { }
}
