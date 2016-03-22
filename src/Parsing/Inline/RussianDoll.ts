import { Token, TokenMeaning } from './Token'
import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'

export class RussianDoll {
  constructor (
    public start: string,
    public end: string,
    public NodeType: RichInlineSyntaxNodeType,
    public meaningStart: TokenMeaning,
    public meaningEnd: TokenMeaning) { }
}