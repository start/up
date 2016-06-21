import { InlineSyntaxNode } from '../SyntaxNodes/InlineSyntaxNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'


export function isWhitespace(node: InlineSyntaxNode): boolean {
  return (node instanceof PlainTextNode) && !/\S/.test(node.text)
}
