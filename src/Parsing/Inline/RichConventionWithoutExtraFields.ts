import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { RichInlineSyntaxNode } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { TokenMeaning } from './Tokenizing/TokenMeaning'


// A rich inline convention is one that can contain other inline conventions.
//
// The `RichConventionWithoutExtraFields` interface represents rich conventions that
// have no extra fields to parse. This excludes linkes, because the parser has to
// worry about their URL.
export interface RichConventionWithoutExtraFields {
  SyntaxNodeType: RichSyntaxNodeWithoutExtraFieldsType
  startTokenMeaning: TokenMeaning
  endTokenMeaning: TokenMeaning
}


export interface RichSyntaxNodeWithoutExtraFieldsType {
  new (children: InlineSyntaxNode[]): RichInlineSyntaxNode
}
