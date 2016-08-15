import { UpDocument, createUpDocument } from '../SyntaxNodes/UpDocument'
import { HeadingLeveler } from './Outline/HeadingLeveler'
import { getOutlineNodes } from './Outline/getOutlineNodes'
import { INPUT_LINE_BREAK } from './Strings'
import { Config } from '../Config'


export function parseDocument(markup: string, config: Config): UpDocument {
  const children = getOutlineNodes({
    markupLines: markup.split(INPUT_LINE_BREAK),
    sourceLineNumber: 1,
    headingLeveler: new HeadingLeveler(),
    config
  })

  return createUpDocument({
    children,
    createTableOfContents: config.createTableOfContents
  })
}
