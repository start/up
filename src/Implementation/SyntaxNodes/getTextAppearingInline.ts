import { InlineSyntaxNode } from './InlineSyntaxNode'


export function getTextAppearingInline(nodes: InlineSyntaxNode[]): string {
  return nodes
    .map(node => node.textAppearingInline())
    .join('')
}
