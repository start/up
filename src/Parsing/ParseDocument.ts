import { getOutlineNodes } from './Outline/GetOutlineNodes'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { applyFootnotes } from './ApplyFootnotes'


export function parseDocument(text: string): DocumentNode {
  const documentNode = new DocumentNode(getOutlineNodes(text))
  applyFootnotes(documentNode)
  
  return documentNode
}
