import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { parseInline } from './ParseInline'

export function getInlineNodes(text: string): SyntaxNode[] {
  let resultNodes: SyntaxNode[] = []

  parseInline(text, {},
    (inlineNodes) => resultNodes = inlineNodes)

  return resultNodes
}