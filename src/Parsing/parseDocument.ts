import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { HeadingLeveler } from './Outline/HeadingLeveler'
import { insertFootnoteBlocks } from './insertFootnoteBlocks'
import { getOutlineNodes } from './Outline/getOutlineNodes'
import { UpConfig } from '../UpConfig'

export function parseDocument(text: string, config: UpConfig): DocumentNode {
  const documentChildren = getOutlineNodes(text, new HeadingLeveler(), config)
  
  const documentNode = new DocumentNode(documentChildren)
  insertFootnoteBlocks(documentNode)
  
  return documentNode
}
