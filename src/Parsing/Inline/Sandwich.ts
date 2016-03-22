import { Token, TokenMeaning } from './Token'
import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'

export class Sandwich {
  constructor (
    public bun: string,
    public NodeType: RichInlineSyntaxNodeType,
    public meaningStart: TokenMeaning,
    public meaningEnd: TokenMeaning) { }
}