import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'

export abstract class InlineSyntaxNode extends SyntaxNode {
  private INLINE_SYNTAX_NODE: any = null
}