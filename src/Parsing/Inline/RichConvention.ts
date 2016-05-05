import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { Convention } from './Convention'
import { TokenType } from './Tokens/Token'

// A rich inline convention can contain other inline conventions.

export class RichConvention {
  constructor (
    public NodeType: RichInlineSyntaxNodeType,
    public StartTokenType: TokenType,
    public EndTokenType: TokenType) { }
}
