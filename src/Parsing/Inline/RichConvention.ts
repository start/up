import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNodeType'
import { TokenType } from './Tokens/TokenType'
import { TokenizerState } from './TokenizerState'


// A rich inline convention is one that can contain other inline conventions.
export interface RichConvention {
   NodeType?: RichInlineSyntaxNodeType,
   StartTokenType: TokenType,
   EndTokenType: TokenType
   tokenizerState?: TokenizerState
}
