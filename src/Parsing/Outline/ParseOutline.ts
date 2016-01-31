import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { ParseResult } from '.././ParseResult'
import { parseInline } from '../Inline/ParseInline'

import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'

export function parseOutline(text: string): ParseResult {
  let nodes: SyntaxNode[] = []

  const lines = text.split('\n')

  for (const line of lines) {
    if (line) {
      const paragraphNode = new ParagraphNode()
      paragraphNode.addChildren(parseInline(line, paragraphNode).nodes)
      nodes.push(paragraphNode)
    }
  }

  return new ParseResult(nodes, text.length)
}