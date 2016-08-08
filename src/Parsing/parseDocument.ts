import { DocumentNode, createDocument } from '../SyntaxNodes/DocumentNode'
import { HeadingLeveler } from './Outline/HeadingLeveler'
import { getOutlineNodes } from './Outline/getOutlineNodes'
import { INPUT_LINE_BREAK } from './Strings'
import { UpConfig } from '../UpConfig'


export function parseDocument(markup: string, config: UpConfig): DocumentNode {
  const markupLines = markup.split(INPUT_LINE_BREAK)
  
  const children =
    getOutlineNodes(markupLines, new HeadingLeveler(), config)

  return createDocument({
    children,
    createTableOfContents: config.settings.createTableOfContents
  })
}
