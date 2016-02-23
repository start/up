import { DocumentNode } from './SyntaxNodes/DocumentNode'
import { getOutlineNodes } from './Parsing/Outline/GetOutlineNodes'

export function ast(text: string): DocumentNode {
  const documentNode = new DocumentNode()
  
  getOutlineNodes(text, { parentNode: documentNode }, (nodes) => {
    documentNode.addChildren(nodes)
  })
  
  return documentNode
}
