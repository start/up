import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { tokenize, tokenizeForInlineDocument } from './Tokenizing/tokenize'
import { parse } from './parse'
import { NormalizedSettings } from '../../NormalizedSettings'


export function getInlineSyntaxNodes(inlineMarkup: string, settings: NormalizedSettings.Parsing): InlineSyntaxNode[] {
  return parse(tokenize(inlineMarkup, settings))
}

export function getInlineSyntaxNodesForInlineDocument(inlineMarkup: string, settings: NormalizedSettings.Parsing): InlineSyntaxNode[] {
  return parse(tokenizeForInlineDocument(inlineMarkup, settings))
}
