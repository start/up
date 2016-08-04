import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { HeadingLeveler } from './Outline/HeadingLeveler'
import { getOutlineNodes } from './Outline/getOutlineNodes'
import { INPUT_LINE_BREAK } from './Strings'
import { UpConfig } from '../UpConfig'
import { getFinalizedDocument } from './getFinalizedDocument'


export function parseDocument(markup: string, config: UpConfig): DocumentNode {
  const markupLines = markup.split(INPUT_LINE_BREAK)
  
  const documentChildren =
    getOutlineNodes(markupLines, new HeadingLeveler(), config)

  return getFinalizedDocument({
    documentChildren,
    createTableOfContents: config.settings.createTableOfContents
  })
}
