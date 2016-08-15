import { InlineUpDocument } from '../SyntaxNodes/InlineUpDocument'
import { getInlineNodesForInlineDocument } from './Inline/getInlineNodes'
import { Config } from '../Config'


export function parseInlineDocument(markup: string, config: Config): InlineUpDocument {
  const children = getInlineNodesForInlineDocument(markup, config)
  return new InlineUpDocument(children)
}
