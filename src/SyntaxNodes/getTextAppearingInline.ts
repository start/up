import { InlineSyntaxNode } from './InlineSyntaxNode'


export function getTextAppearingInline(nodes: InlineSyntaxNode[]): string {
  return nodes
    .map(child => child.textAppearingInline())
    .join('')
}
