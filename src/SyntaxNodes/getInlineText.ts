import { InlineSyntaxNode } from './InlineSyntaxNode'


export function getInlineText(nodes: InlineSyntaxNode[]): string {
  return nodes
    .map(child => child.inlineText())
    .join('')
}
