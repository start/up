import { getOutlineNodes } from './Outline/GetOutlineNodes'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { produceFootnoteBlocks } from './ProduceFootnoteBlocks'


export function parseDocument(text: string): DocumentNode {
  const documentNode = new DocumentNode(getOutlineNodes(text))
  produceFootnoteBlocks(documentNode)
  
  return documentNode
}
