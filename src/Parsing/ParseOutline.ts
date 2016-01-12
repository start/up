import { ParagraphNode } from '../SyntaxNodes/ParagraphNode'
import { ParseResult } from './ParseResult'
import { parseInline } from './ParseInline'

import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'

export function parseOutline(text: string): ParseResult {
  let nodes: SyntaxNode[] = []

  if (text) {
    const paragraphNode = new ParagraphNode()
    paragraphNode.addChildren(parseInline(text, paragraphNode).nodes)
    nodes.push(paragraphNode)
  }

  return new ParseResult(nodes, text.length)
}