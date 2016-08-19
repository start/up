import { InlineSyntaxNode } from '../SyntaxNodes/InlineSyntaxNode'
import { PlainText } from '../SyntaxNodes/PlainText'
import { BLANK_PATTERN } from './Patterns'


export function isWhitespace(node: InlineSyntaxNode): boolean {
  return (node instanceof PlainText) && BLANK_PATTERN.test(node.content)
}
