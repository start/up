import { insertFootnoteBlocksAndAssignFootnoteReferenceNumbers } from './insertFootnoteBlocksAndAssignFootnoteReferenceNumbers'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { HeadingLeveler } from './Outline/HeadingLeveler'
import { getOutlineNodes } from './Outline/getOutlineNodes'
import { INPUT_LINE_BREAK } from './Strings'
import { UpConfig } from '../UpConfig'


export function parseDocument(markup: string, config: UpConfig): DocumentNode {
  const markupLines = markup.split(INPUT_LINE_BREAK)
  const documentChildren = getOutlineNodes(markupLines, new HeadingLeveler(), config)

  const documentNode = new DocumentNode(documentChildren)
  insertFootnoteBlocksAndAssignFootnoteReferenceNumbers(documentNode)

  return documentNode
}
