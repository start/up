import { RichInlineSyntaxNode } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { TokenKind } from './Tokenization/TokenKind'


export interface RichInlineSyntaxNodeType {
  new (..._1: any[]): RichInlineSyntaxNode
}


// A rich inline convention is one that can contain other inline conventions.
export interface RichConvention {
   NodeType?: RichInlineSyntaxNodeType
   startTokenKind: TokenKind
   endTokenKind: TokenKind
}
