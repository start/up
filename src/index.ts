import { DocumentNode } from './SyntaxNodes/DocumentNode'
import { parseOutline } from './Parsing/Outline/ParseOutline'

export function ast(text: string): DocumentNode {
  const documentNode = new DocumentNode()
  
  parseOutline(text, (nodes) => {
    documentNode.addChildren(nodes)
  })
  
  return documentNode
}