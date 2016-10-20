import { InlineDocument } from '../SyntaxNodes/InlineDocument'
import { getInlineSyntaxNodesForInlineDocument } from './Inline/getInlineSyntaxNodes'
import { NormalizedSettings } from '../NormalizedSettings'


export function parseInline(inlineMarkup: string, settings: NormalizedSettings.Parsing): InlineDocument {
  const children = getInlineSyntaxNodesForInlineDocument(inlineMarkup, settings)
  return new InlineDocument(children)
}
