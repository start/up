import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNodeType'
import { TokenType } from './Tokens/TokenType'
import { TokenizerGoal } from './TokenizerGoal'


// A rich inline convention is one that can contain other inline conventions.
export interface RichConvention {
   NodeType?: RichInlineSyntaxNodeType,
   StartTokenType: TokenType,
   EndTokenType: TokenType
   tokenizerGoal?: TokenizerGoal
}
