import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { parseInlineConventions } from './ParseInlineConventions'

export function getInlineNodes(text: string): SyntaxNode[] {
  let resultNodes: SyntaxNode[] = []

  parseInlineConventions({
    text: text,
    then: (inlineNodes) => resultNodes = inlineNodes
  })

  return resultNodes
}