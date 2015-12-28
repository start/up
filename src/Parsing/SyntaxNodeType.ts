import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'

export interface SyntaxNodeType {
  new (): SyntaxNode
}