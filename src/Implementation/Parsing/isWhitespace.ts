import { BLANK_PATTERN } from '../Patterns'
import { InlineSyntaxNode } from '../SyntaxNodes/InlineSyntaxNode'
import { Text } from '../SyntaxNodes/Text'


export function isWhitespace(node: InlineSyntaxNode): boolean {
  return (node instanceof Text) && BLANK_PATTERN.test(node.text)
}
