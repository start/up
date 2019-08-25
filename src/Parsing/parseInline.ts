import { NormalizedSettings } from '../NormalizedSettings'
import { InlineDocument } from '../SyntaxNodes/InlineDocument'
import { getInlineSyntaxNodesForInlineDocument } from './Inline/getInlineSyntaxNodes'


export function parseInline(inlineMarkup: string, settings: NormalizedSettings.Parsing): InlineDocument {
  const children = getInlineSyntaxNodesForInlineDocument(inlineMarkup, settings)
  return new InlineDocument(children)
}
