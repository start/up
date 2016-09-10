import { InlineUpDocument } from '../SyntaxNodes/InlineUpDocument'
import { getInlineSyntaxNodesForInlineDocument } from './Inline/getInlineSyntaxNodes'
import { Settings } from '../Settings'


export function parseInline(markup: string, settings: Settings.Parsing): InlineUpDocument {
  const children = getInlineSyntaxNodesForInlineDocument(markup, settings)
  return new InlineUpDocument(children)
}
