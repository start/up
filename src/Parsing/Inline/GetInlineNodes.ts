import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { TextConsumer } from '../TextConsumer'
import { last } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'
import { tokenize } from './Tokenize'
import { parse } from './Parse'

export function getInlineNodes(text: string): InlineSyntaxNode[] {
  return parse(tokenize(text))
}
