import { Document } from '../SyntaxNodes/Document'
import { HeadingLeveler } from './Outline/HeadingLeveler'
import { getOutlineSyntaxNodes } from './Outline/getOutlineSyntaxNodes'
import { NormalizedSettings } from '../NormalizedSettings'


export function parse(markup: string, settings: NormalizedSettings.Parsing): Document {
  const children = getOutlineSyntaxNodes({
    markupLines: markup.split(MARKUP_LINE_BREAK),
    sourceLineNumber: 1,
    headingLeveler: new HeadingLeveler(),
    settings
  })

  return Document.create(children)
}

// Eventually, this should be configurable.
export const MARKUP_LINE_BREAK = '\n'
