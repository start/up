import { InlineSyntaxNode } from './InlineSyntaxNode'
import { getInlineDescendants } from './getInlineDescendants'


export abstract class InlineSyntaxNodeContainer {
  constructor(public children: InlineSyntaxNode[]) { }

  inlineDescendants(): InlineSyntaxNode[] {
    return getInlineDescendants(this.children)
  }
}
