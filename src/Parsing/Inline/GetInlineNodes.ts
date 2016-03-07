import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { parseInlineConventions } from './ParseInlineConventions'

export function getInlineNodes(text: string): InlineSyntaxNode[] {
  let resultNodes: InlineSyntaxNode[] = []

  parseInlineConventions({
    text: text,
    parentNodeTypes: [],
    then: (inlineNodes) => resultNodes = inlineNodes
  })

  return resultNodes
}