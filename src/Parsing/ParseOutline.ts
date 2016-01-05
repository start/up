import { ParagraphNode } from '../SyntaxNodes/ParagraphNode'
import { ParseResult } from './ParseResult'
import { SuccessfulParseResult } from './SuccessfulParseResult'
import { parseInline } from './ParseInline'

export function parseOutline(text: string): ParseResult {
  if (!text) {
    return new SuccessfulParseResult([], 0)
  }
  
  const paragraphNode = new ParagraphNode()
  paragraphNode.addChildren(parseInline(text, paragraphNode).nodes)
  
  return new SuccessfulParseResult([paragraphNode], text.length)
}