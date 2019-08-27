import { NormalizedSettings } from '../../NormalizedSettings'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { parse } from './parse'
import { tokenize, tokenizeForInlineDocument } from './Tokenizing/tokenize'


export function getInlineSyntaxNodes(inlineMarkup: string, settings: NormalizedSettings.Parsing): InlineSyntaxNode[] {
  return parse(tokenize(inlineMarkup, settings))
}

export function getInlineSyntaxNodesForInlineDocument(inlineMarkup: string, settings: NormalizedSettings.Parsing): InlineSyntaxNode[] {
  return parse(tokenizeForInlineDocument(inlineMarkup, settings))
}
