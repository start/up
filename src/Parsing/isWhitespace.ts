import { InlineSyntaxNode } from '../SyntaxNodes/InlineSyntaxNode'
import { Text } from '../SyntaxNodes/Text'
import { BLANK_PATTERN } from '../Patterns'


export function isWhitespace(node: InlineSyntaxNode): boolean {
  return (node instanceof Text) && BLANK_PATTERN.test(node.text)
}
