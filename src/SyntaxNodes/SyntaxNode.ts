import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export interface SyntaxNode {
  inlineDescendants(): InlineSyntaxNode[]
}