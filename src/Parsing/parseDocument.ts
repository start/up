import { UpDocument } from '../SyntaxNodes/UpDocument'
import { HeadingLeveler } from './Outline/HeadingLeveler'
import { getOutlineSyntaxNodes } from './Outline/getOutlineSyntaxNodes'
import { INPUT_LINE_BREAK } from './Strings'
import { Config } from '../Config'


export function parseDocument(markup: string, config: Config): UpDocument {
  const children = getOutlineSyntaxNodes({
    markupLines: markup.split(INPUT_LINE_BREAK),
    sourceLineNumber: 1,
    headingLeveler: new HeadingLeveler(),
    config
  })

  return UpDocument.create(children)
}
