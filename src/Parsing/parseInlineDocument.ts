import { InlineUpDocument } from '../SyntaxNodes/InlineUpDocument'
import { getInlineSyntaxNodesForInlineDocument } from './Inline/getInlineSyntaxNodes'
import { Config } from '../Config'


export function parseInlineDocument(markup: string, config: Config): InlineUpDocument {
  const children = getInlineSyntaxNodesForInlineDocument(markup, config)
  return new InlineUpDocument(children)
}
