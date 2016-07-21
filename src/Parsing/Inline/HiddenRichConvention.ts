import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { RichInlineSyntaxNode } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { TokenKind } from './Tokenization/TokenKind'
import { RichConventionWithoutExtraFields, RichSyntaxNodeWithoutExtraFields } from './RichConventionWithoutExtraFields'

// A rich inline convention is one that can contain other inline conventions.
export class HiddenRichConvention {
  NodeType: RichSyntaxNodeWithoutExtraFields
  startTokenKind: TokenKind
  endTokenKind: TokenKind
}
