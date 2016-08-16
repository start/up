import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { tokenize, tokenizeForInlineDocument } from './Tokenization/tokenize'
import { parse } from './parse'
import { Config } from '../../Config'


export function getInlineNodes(markup: string, config: Config): InlineSyntaxNode[] {
  return parse(tokenize(markup, config))
}

export function getInlineNodesForInlineDocument(markup: string, config: Config): InlineSyntaxNode[] {
  return parse(tokenizeForInlineDocument(markup, config))
}
