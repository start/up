import { TokenMeaning } from './Token'
import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { last } from '../CollectionHelpers'

export class Convention {
  public meanings: TokenMeaning[]
  
  constructor(public NodeType: RichInlineSyntaxNodeType, ...meanings: TokenMeaning[]) {
    this.meanings = meanings
  }
  
  startMeaning(): TokenMeaning {
    return this.meanings[0]
  }
  
  endMeaning(): TokenMeaning {
    return last(this.meanings)
  }
}