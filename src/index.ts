import { DocumentNode } from './SyntaxNodes/DocumentNode'

export function ast(text: string): DocumentNode {
  return new DocumentNode([])
}