import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { InlineTextConsumer } from './InlineTextConsumer'
import { last } from '../CollectionHelpers'
import { tokenize } from './Tokenize'
import { parse } from './Parse'
import { UpConfig } from '../../UpConfig'

export function getInlineNodes(text: string, config: UpConfig): InlineSyntaxNode[] {
  return parse(tokenize(text, config))
}
