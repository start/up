import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { Tokenizer } from './Tokenizing/Tokenizer'
import { tokenize } from './Tokenizing/tokenize'
import { parse } from './parse'
import { UpConfig } from '../../UpConfig'

export function getInlineNodes(text: string, config: UpConfig): InlineSyntaxNode[] {
  return parse({
    tokens: tokenize(text, config)
  }).nodes
}
