import { DocumentNode } from './SyntaxNodes/DocumentNode'
import { getOutlineNodes } from './Parsing/Outline/GetOutlineNodes'

export function ast(text: string): DocumentNode {
  return new DocumentNode(getOutlineNodes(text))
}
