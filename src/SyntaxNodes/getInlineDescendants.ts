import { InlineSyntaxNode } from './InlineSyntaxNode'
import { concat } from '../CollectionHelpers'


export function getInlineDescendants(nodes: InlineSyntaxNode[]): InlineSyntaxNode[] {
  return concat(
    nodes.map(child => [child, ...child.inlineDescendants()]))
}
