import { TokenizerGoal } from './TokenizerGoal'
import { Bracket } from './Bracket'
import { startsWith } from '../../Patterns'

export class TokenizableBracket {
  public startPattern: RegExp
  public endPattern: RegExp
  
  constructor(public goal: TokenizerGoal, bracket: Bracket) {
    this.startPattern = getPattern(bracket.startBracketPattern)
    this.endPattern = getPattern(bracket.endBracketPattern)
  }
}

function getPattern(bracketPattern: string): RegExp {
  return new RegExp(startsWith(bracketPattern))
}
