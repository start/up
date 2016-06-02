import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNodeType'
import { TokenKind } from './TokenKind'
import { TokenizerGoal } from './TokenizerGoal'


// A rich inline convention is one that can contain other inline conventions.
export interface RichConvention {
   NodeType?: RichInlineSyntaxNodeType,
   StartTokenType: TokenKind,
   EndTokenType: TokenKind,
   tokenizerGoal?: TokenizerGoal
}
