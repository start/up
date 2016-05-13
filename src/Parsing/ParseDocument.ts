import { getOutlineNodes } from './Outline/GetOutlineNodes'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { insertFootnoteBlocks } from './InsertFootnoteBlocks'
import { HeadingLeveler } from './Outline/HeadingLeveler'
import { UpConfig } from '../UpConfig'

export function parseDocument(text: string, config: UpConfig): DocumentNode {
  const documentNode =
    new DocumentNode(getOutlineNodes(text, new HeadingLeveler(), config))
  
  insertFootnoteBlocks(documentNode)
  
  return documentNode
}
