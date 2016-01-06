import { ParagraphNode } from '../SyntaxNodes/ParagraphNode'
import { ParseResult } from './ParseResult'
import { CompletedParseResult } from './CompletedParseResult'
import { parseInline } from './ParseInline'

export function parseOutline(text: string): ParseResult {
  if (!text) {
    return new CompletedParseResult([], 0)
  }
  
  const paragraphNode = new ParagraphNode()
  paragraphNode.addChildren(parseInline(text, paragraphNode).nodes)
  
  return new CompletedParseResult([paragraphNode], text.length)
}