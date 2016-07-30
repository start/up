import { InlineSyntaxNode } from '../SyntaxNodes/InlineSyntaxNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { BLANK_PATTERN } from './Patterns'


export function isWhitespace(node: InlineSyntaxNode): boolean {
  return (node instanceof PlainTextNode) && BLANK_PATTERN.test(node.content)
}
