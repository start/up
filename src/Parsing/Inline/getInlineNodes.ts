import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { tokenize } from './Tokenization/tokenize'
import { parse, parseForInlineDocument } from './parse'
import { Config } from '../../Config'


export function getInlineNodes(markup: string, config: Config): InlineSyntaxNode[] {
  return parse(tokenize(markup, config))
}

export function getInlineNodesForInlineDocument(markup: string, config: Config): InlineSyntaxNode[] {
  return parseForInlineDocument(tokenize(markup, config))
}
