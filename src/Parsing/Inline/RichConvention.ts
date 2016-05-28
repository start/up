import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNodeType'
import { TokenType } from './Tokenizing/Tokens/TokenType'


// A rich inline convention is one that can contain other inline conventions.
export interface RichConvention {
   NodeType?: RichInlineSyntaxNodeType,
   StartTokenType: TokenType,
   EndTokenType: TokenType
}
