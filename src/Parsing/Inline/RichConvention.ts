import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { TokenType } from './Tokens/Token'

// A rich inline convention is one that can contain other inline conventions.
export class RichConvention {
  constructor (
    public NodeType: RichInlineSyntaxNodeType,
    public StartTokenType: TokenType,
    public EndTokenType: TokenType) { }
}
