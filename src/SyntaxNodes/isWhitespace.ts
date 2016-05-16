import { InlineSyntaxNode } from './InlineSyntaxNode'
import { PlainTextNode } from './PlainTextNode'

export function isWhitespace(node: InlineSyntaxNode): boolean {
  return (node instanceof PlainTextNode) && !/\S/.test(node.text)
}
