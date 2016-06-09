import { InlineSyntaxNode } from '../SyntaxNodes/InlineSyntaxNode'
import { RichInlineSyntaxNode } from '../SyntaxNodes/RichInlineSyntaxNode'


export interface RichInlineSyntaxNodeType {
  new(children: InlineSyntaxNode[]): RichInlineSyntaxNode
}
