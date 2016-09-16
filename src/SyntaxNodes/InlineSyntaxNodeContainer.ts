import { InlineSyntaxNode } from './InlineSyntaxNode'
import { getInlineDescendants } from './getInlineDescendants'


export abstract class InlineSyntaxNodeContainer {
  constructor(public children: InlineSyntaxNode[]) { }

  // All inline descendants (including `children`, grandchildren, etc.).
  inlineDescendants(): InlineSyntaxNode[] {
    return getInlineDescendants(this.children)
  }
}
