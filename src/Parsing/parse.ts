import { Document } from '../SyntaxNodes/Document'
import { HeadingLeveler } from './Outline/HeadingLeveler'
import { getOutlineSyntaxNodes } from './Outline/getOutlineSyntaxNodes'
import { INPUT_LINE_BREAK } from './Strings'
import { Settings } from '../Settings'


export function parse(markup: string, settings: Settings.Parsing): Document {
  const children = getOutlineSyntaxNodes({
    markupLines: markup.split(INPUT_LINE_BREAK),
    sourceLineNumber: 1,
    headingLeveler: new HeadingLeveler(),
    settings
  })

  return Document.create(children)
}
