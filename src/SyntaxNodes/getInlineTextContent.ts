import { InlineSyntaxNode } from './InlineSyntaxNode'


export function getInlineTextContent(nodes: InlineSyntaxNode[]): string {
  return nodes
    .map(child => child.inlineTextContent())
    .join('')
}