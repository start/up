import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { Convention } from './Convention'
import { TokenType } from './Tokens/Token'

export class SandwichConvention {
  constructor (
    public start: string,
    public end: string,
    public NodeType: RichInlineSyntaxNodeType,
    public StartTokenType: TokenType,
    public EndTokenType: TokenType) { }
}
