import { InlineSyntaxNode } from './InlineSyntaxNode'


export function getSearchableText(nodes: InlineSyntaxNode[]): string {
  return nodes
    .map(child => child.searchableText())
    .join('')
}
