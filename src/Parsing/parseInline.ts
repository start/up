import { InlineDocument } from '../SyntaxNodes/InlineDocument'
import { getInlineSyntaxNodesForInlineDocument } from './Inline/getInlineSyntaxNodes'
import { Settings } from '../Settings'


export function parseInline(inlineMarkup: string, settings: Settings.Parsing): InlineDocument {
  const children = getInlineSyntaxNodesForInlineDocument(inlineMarkup, settings)
  return new InlineDocument(children)
}
