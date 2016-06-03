import { TokenizerGoal } from './TokenizerGoal'
import { Bracket } from './Bracket'
import { startsWith } from '../../Patterns'

export class TokenizableRawTextBracket {
  public startPattern: RegExp
  public endPattern: RegExp
  
  constructor(public goal: TokenizerGoal, bracket: Bracket) {
    this.startPattern = getPattern(bracket.startPattern)
    this.endPattern = getPattern(bracket.endPattern)
  }
}

function getPattern(bracketPattern: string): RegExp {
  return new RegExp(startsWith(bracketPattern))
}
