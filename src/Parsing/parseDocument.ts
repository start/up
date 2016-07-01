import { handleFootnotes } from './handleFootnotes'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { HeadingLeveler } from './Outline/HeadingLeveler'
import { getOutlineNodes } from './Outline/getOutlineNodes'
import { INPUT_LINE_BREAK } from './Strings'
import { UpConfig } from '../UpConfig'


export function parseDocument(text: string, config: UpConfig): DocumentNode {
  const lines = text.split(INPUT_LINE_BREAK)
  const outlineNodes = getOutlineNodes(lines, new HeadingLeveler(), config)
  
  const documentNode = new DocumentNode(outlineNodes)
  handleFootnotes(documentNode)

  return documentNode
}
