import { getInlineDescendants } from './getInlineDescendants'
import { InlineSyntaxNode } from './InlineSyntaxNode'


export abstract class InlineSyntaxNodeContainer {
  constructor(public children: InlineSyntaxNode[]) { }

  // All inline descendants (including `children`, grandchildren, etc.).
  inlineDescendants(): InlineSyntaxNode[] {
    return getInlineDescendants(this.children)
  }
}
