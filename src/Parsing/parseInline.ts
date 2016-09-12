import { InlineDocument } from '../SyntaxNodes/InlineDocument'
import { getInlineSyntaxNodesForInlineDocument } from './Inline/getInlineSyntaxNodes'
import { Settings } from '../Settings'


export function parseInline(markup: string, settings: Settings.Parsing): InlineDocument {
  const children = getInlineSyntaxNodesForInlineDocument(markup, settings)
  return new InlineDocument(children)
}
