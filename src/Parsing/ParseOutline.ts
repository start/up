import { ParagraphNode } from '../SyntaxNodes/ParagraphNode'
import { ParseResult } from './ParseResult'
import { parseInline } from './ParseInline'

export function parseOutline(text: string): ParseResult {
  if (!text) {
    return new ParseResult([], 0)
  }
  
  const paragraphNode = new ParagraphNode()
  paragraphNode.addChildren(parseInline(text, paragraphNode).nodes)
  
  return new ParseResult([paragraphNode], text.length)
}