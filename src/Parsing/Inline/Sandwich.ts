import { Token, TokenMeaning } from './Token'
import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'

export class Sandwich {
  constructor (
    public bun: string,
    public nodeType: RichInlineSyntaxNodeType,
    public start: TokenMeaning,
    public end: TokenMeaning) { }
}