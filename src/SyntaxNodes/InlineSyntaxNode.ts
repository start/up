import { SyntaxNode } from './SyntaxNode'

export interface InlineSyntaxNode extends SyntaxNode {
  text(): string
}
