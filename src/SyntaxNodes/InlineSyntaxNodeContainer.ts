import { InlineSyntaxNode } from './InlineSyntaxNode'


export abstract class InlineSyntaxNodeContainer {
  constructor(public children: InlineSyntaxNode[]) { }

  inlineDescendants(): InlineSyntaxNode[] {
    return this.children
  }
}
