import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { HeadingLeveler } from './Outline/HeadingLeveler'
import { insertFootnoteBlocks } from './insertFootnoteBlocks'
import { getOutlineNodes } from './Outline/getOutlineNodes'
import { UpConfig } from '../UpConfig'

export function parseDocument(text: string, config: UpConfig): DocumentNode {
  const documentNode =
    new DocumentNode(
      getOutlineNodes(text, new HeadingLeveler(), config))

  insertFootnoteBlocks(documentNode)

  return documentNode
}
