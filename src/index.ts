import { DocumentNode } from './SyntaxNodes/DocumentNode'
import { parseOutline } from './Parsing/ParseOutline'

export function ast(text: string): DocumentNode {
  return new DocumentNode(parseOutline(text).nodes)
}