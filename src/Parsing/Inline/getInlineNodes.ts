import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { Tokenizer } from './Tokenizer'
import { parse } from './parse'
import { UpConfig } from '../../UpConfig'

export function getInlineNodes(text: string, config: UpConfig): InlineSyntaxNode[] {
  return parse({
    tokens: new Tokenizer(text, config).tokens
  }).nodes
}
