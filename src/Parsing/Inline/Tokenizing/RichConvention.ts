import { TokenType } from './Tokens/TokenType'
import { TokenizerGoal } from './TokenizerGoal'


// A rich inline convention is one that can contain other inline conventions.
export interface RichConvention {
   StartTokenType: TokenType,
   EndTokenType: TokenType
   tokenizerGoal?: TokenizerGoal
}
