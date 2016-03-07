import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { InlineSyntaxNode } from '../SyntaxNodes/InlineSyntaxNode'

export interface RichInlineSyntaxNodeType {
  new(children: InlineSyntaxNode[]): RichInlineSyntaxNode
}

export abstract class RichInlineSyntaxNode extends InlineSyntaxNode {
  constructor(public children: InlineSyntaxNode[]) {
    super()
  }
  
  private RICH_INLINE_SYNTAX_NODE: any = null
}