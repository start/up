import { InlineSyntaxNode } from './InlineSyntaxNode'


export interface SyntaxNode {
  inlineDescendants(): InlineSyntaxNode[]
}