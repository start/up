import { InlineUpDocument } from '../SyntaxNodes/InlineUpDocument'
import { getInlineNodes } from './Inline/getInlineNodes'
import { Config } from '../Config'


export function parseInlineDocument(markup: string, config: Config): InlineUpDocument {
  return new InlineUpDocument(getInlineNodes(markup, config))
}
