import { SyntaxNode } from './SyntaxNode'


export interface InlineSyntaxNode extends SyntaxNode {
  inlineText(): string
}
