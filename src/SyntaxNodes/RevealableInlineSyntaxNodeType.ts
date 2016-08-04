import { InlineSyntaxNode } from './InlineSyntaxNode'
import { RevealableInlineSyntaxNode } from './RevealableInlineSyntaxNode'


export interface RevealableInlineSyntaxNodeType {
  new (children: InlineSyntaxNode[]): RevealableInlineSyntaxNode
}
