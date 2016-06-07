import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNodeType'
import { TokenKind } from './TokenKind'


// A rich inline convention is one that can contain other inline conventions.
export interface RichConvention {
   NodeType?: RichInlineSyntaxNodeType,
   startTokenKind: TokenKind,
   endTokenKind: TokenKind
}
