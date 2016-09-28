import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { RichInlineSyntaxNode } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { TokenRole } from './TokenRole'


// A rich inline convention is one that can contain other inline conventions.
//
// The `RichConventionWithoutExtraFields` interface represents rich inline conventions
// whose syntax nodes can be produced without any extra fields. This excludes links,
// because their URL is required.
export interface RichConventionWithoutExtraFields {
  SyntaxNodeType: new (children: InlineSyntaxNode[]) => RichInlineSyntaxNode
  startTokenRole: TokenRole
  endTokenRole: TokenRole
}
