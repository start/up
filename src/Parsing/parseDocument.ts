import { handleFootnotes } from './handleFootnotes'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { HeadingLeveler } from './Outline/HeadingLeveler'
import { getOutlineNodes } from './Outline/getOutlineNodes'
import { INPUT_LINE_BREAK } from './Strings'
import { UpConfig } from '../UpConfig'


export function parseDocument(text: string, config: UpConfig): DocumentNode {
  const documentLines = text.split(INPUT_LINE_BREAK)
  const documentChildren = getOutlineNodes(documentLines, new HeadingLeveler(), config)

  const documentNode = new DocumentNode(documentChildren)
  handleFootnotes(documentNode)

  return documentNode
}
