import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { RichInlineSyntaxNode } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { TokenKind } from './Tokenization/TokenKind'


// A rich inline convention is one that can contain other inline conventions.
export interface RichConventionWithoutExtraFields {
  NodeType: new (children: InlineSyntaxNode[]) => RichInlineSyntaxNode
  startTokenKind: TokenKind
  endTokenKind: TokenKind
}
