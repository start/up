import { InlineUpDocument } from '../SyntaxNodes/InlineUpDocument'
import { getInlineSyntaxNodesForInlineDocument } from './Inline/getInlineSyntaxNodes'
import { Config } from '../Config'


export function parseInline(markup: string, config: Config.Parsing): InlineUpDocument {
  const children = getInlineSyntaxNodesForInlineDocument(markup, config)
  return new InlineUpDocument(children)
}
