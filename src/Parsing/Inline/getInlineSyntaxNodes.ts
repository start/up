import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { tokenize, tokenizeForInlineDocument } from './Tokenizing/tokenize'
import { parse } from './parse'
import { Settings } from '../../Settings'


export function getInlineSyntaxNodes(inlineMarkup: string, settings: Settings.Parsing): InlineSyntaxNode[] {
  return parse(tokenize(inlineMarkup, settings))
}

export function getInlineSyntaxNodesForInlineDocument(inlineMarkup: string, settings: Settings.Parsing): InlineSyntaxNode[] {
  return parse(tokenizeForInlineDocument(inlineMarkup, settings))
}
