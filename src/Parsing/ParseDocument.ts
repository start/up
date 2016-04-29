import { getOutlineNodes } from './Outline/GetOutlineNodes'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { produceFootnoteBlocks } from './ProduceFootnoteBlocks'
import { UpConfig } from '../UpConfig'

export function parseDocument(text: string, config: UpConfig): DocumentNode {
  const documentNode = new DocumentNode(getOutlineNodes(text, config))
  produceFootnoteBlocks(documentNode)
  
  return documentNode
}
