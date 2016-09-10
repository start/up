import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { tokenize, tokenizeForInlineDocument } from './Tokenizing/tokenize'
import { parse } from './parse'
import { Settings } from '../../Settings'


export function getInlineSyntaxNodes(markup: string, settings: Settings.Parsing): InlineSyntaxNode[] {
  return parse(tokenize(markup, settings))
}

export function getInlineSyntaxNodesForInlineDocument(markup: string, settings: Settings.Parsing): InlineSyntaxNode[] {
  return parse(tokenizeForInlineDocument(markup, settings))
}
