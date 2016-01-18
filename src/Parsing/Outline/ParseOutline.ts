import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { ParseResult } from '.././ParseResult'
import { parseInline } from '../Inline/ParseInline'

import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'

export function parseOutline(text: string): ParseResult {
  let nodes: SyntaxNode[] = []
  
  if (!text) {
    return new ParseResult([], 0)
  }
  
  const paragraphNode = new ParagraphNode()
  
  paragraphNode.addChildren(parseInline(text, paragraphNode).nodes)
  
  return new ParseResult([paragraphNode], text.length)
}