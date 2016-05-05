import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { tokenize } from './Tokenize'
import { parse } from './Parse'
import { UpConfig } from '../../UpConfig'

export function getInlineNodes(text: string, config: UpConfig): InlineSyntaxNode[] {
  return parse(tokenize(text, config))
}
