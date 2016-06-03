import { TokenizerGoal } from './TokenizerGoal'
import { Bracket } from './Bracket'
import { RichConvention } from './RichConvention'
import { startsWith } from '../../Patterns'

export class TokenizableRichBracket {
  public startPattern: RegExp
  public endPattern: RegExp
  public rawStartBracket: string
  public rawEndBracket: string
  
  constructor(public convention: RichConvention, bracket: Bracket) {
    this.startPattern = getPattern(bracket.startPattern)
    this.endPattern = getPattern(bracket.endPattern)
    this.rawEndBracket = bracket.start
    this.rawEndBracket = bracket.end
  }
}

function getPattern(bracketPattern: string): RegExp {
  return new RegExp(startsWith(bracketPattern))
}
