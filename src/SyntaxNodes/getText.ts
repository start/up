import { InlineSyntaxNode } from './InlineSyntaxNode'


export function getText(nodes: InlineSyntaxNode[]): string {
  return nodes
    .map(child => child.text())
    .join('')
}