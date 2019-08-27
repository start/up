import { concat } from '../CollectionHelpers'
import { InlineSyntaxNode } from './InlineSyntaxNode'


export function getInlineDescendants(nodes: InlineSyntaxNode[]): InlineSyntaxNode[] {
  return concat(
    nodes.map(node => [node, ...node.inlineDescendants()]))
}
