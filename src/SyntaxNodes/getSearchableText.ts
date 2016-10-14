import { InlineSyntaxNode } from './InlineSyntaxNode'


export function getSearchableText(nodes: InlineSyntaxNode[]): string {
  return nodes
    .map(node => node.searchableText())
    .join('')
}
