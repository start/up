import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { tokenize, tokenizeForInlineDocument } from './Tokenizing/tokenize'
import { parse } from './parse'
import { Config } from '../../Config'


export function getInlineSyntaxNodes(markup: string, config: Config.Parsing): InlineSyntaxNode[] {
  return parse(tokenize(markup, config))
}

export function getInlineSyntaxNodesForInlineDocument(markup: string, config: Config.Parsing): InlineSyntaxNode[] {
  return parse(tokenizeForInlineDocument(markup, config))
}
