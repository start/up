import { Token, TokenType } from './Tokens/Token'
import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { last } from '../CollectionHelpers'

export class Convention {
  public tokenTypes: TokenType[]
  
  constructor(...tokenTypes: TokenType[]) {
    this.tokenTypes = tokenTypes
  }
  
  startTokenType(): TokenType {
    return this.tokenTypes[0]
  }
  
  endTokenType(): TokenType {
    return last(this.tokenTypes)
  }
}
