import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { RichInlineSyntaxNode } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { TokenKind } from './Tokenization/TokenKind'


// A rich inline convention is one that can contain other inline conventions.
//
// The `RichConventionWithoutExtraFields` interface represents rich conventions that
// have no extra fields to parse. This excludes linkes, because the parser has to
// worry about their URL.
export interface RichConventionWithoutExtraFields {
  NodeType: RichSyntaxNodeWithoutExtraFieldsType
  startTokenKind: TokenKind
  endTokenKind: TokenKind
}


export interface RichSyntaxNodeWithoutExtraFieldsType {
  new (children: InlineSyntaxNode[]): RichInlineSyntaxNode
}
