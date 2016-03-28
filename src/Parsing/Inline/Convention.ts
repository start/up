import { TokenMeaning } from './Token'
import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { last } from '../CollectionHelpers'

export class Convention {
  public tokenMeanings: TokenMeaning[]
  
  constructor(...meanings: TokenMeaning[]) {
    this.tokenMeanings = meanings
  }
  
  startTokenMeaning(): TokenMeaning {
    return this.tokenMeanings[0]
  }
  
  endTokenMeaning(): TokenMeaning {
    return last(this.tokenMeanings)
  }
}