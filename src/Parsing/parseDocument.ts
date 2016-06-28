import { handleFootnotes } from './handleFootnotes'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { HeadingLeveler } from './Outline/HeadingLeveler'
import { getOutlineNodes } from './Outline/getOutlineNodes'
import { UpConfig } from '../UpConfig'


export function parseDocument(text: string, config: UpConfig): DocumentNode {
  const documentChildren = getOutlineNodes(text, new HeadingLeveler(), config) 
  const documentNode = new DocumentNode(documentChildren)
  
  handleFootnotes(documentNode)

  return documentNode
}
