import { UpDocument } from '../SyntaxNodes/UpDocument'
import { HeadingLeveler } from './Outline/HeadingLeveler'
import { getOutlineSyntaxNodes } from './Outline/getOutlineSyntaxNodes'
import { INPUT_LINE_BREAK } from './Strings'
import { Settings } from '../Settings'


export function parse(markup: string, settings: Settings.Parsing): UpDocument {
  const children = getOutlineSyntaxNodes({
    markupLines: markup.split(INPUT_LINE_BREAK),
    sourceLineNumber: 1,
    headingLeveler: new HeadingLeveler(),
    settings
  })

  return UpDocument.create(children)
}
