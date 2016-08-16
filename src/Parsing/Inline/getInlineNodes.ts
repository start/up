import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { tokenize, tokenizeForInlineDocument } from './Tokenization/tokenize'
import { parse } from './parse'
import { Config } from '../../Config'


export function getInlineNodes(markup: string, config: Config): InlineSyntaxNode[] {
  return parse(tokenize(markup, config))
}

// This function is identical to the `getInlineNodes` function, except footnotes are treated as
// parentheticals of the appropriate bracket type.
//
// In other words:
//
// 1. Footnotes produced by square brackets [^ like this] are treated as square-bracket parentheticals.
// 2. Footnotes produced by parentheses (^ like this) are treated as normal parentheticals.
export function getInlineNodesForInlineDocument(markup: string, config: Config): InlineSyntaxNode[] {
  return parse(tokenizeForInlineDocument(markup, config))
}
