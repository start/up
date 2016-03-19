import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'

export function getInlineNodes(text: string): InlineSyntaxNode[] {
  return [new PlainTextNode(text)]
}