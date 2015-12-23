import { DocumentNode } from './SyntaxNodes/DocumentNode'

export function ast(): DocumentNode {
  return new DocumentNode([])
}