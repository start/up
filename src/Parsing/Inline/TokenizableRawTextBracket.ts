import { TokenizerGoal } from './TokenizerGoal'
import { Bracket } from './Bracket'
import { startsWith } from '../../Patterns'

export class TokenizableRawTextBracket {
  goal: TokenizerGoal
  startPattern: RegExp
  endPattern: RegExp

  constructor(args: { goal: TokenizerGoal, bracket: Bracket }) {
    const { goal, bracket } = args
    
    this.goal = goal
    this.startPattern = getPattern(bracket.startPattern)
    this.endPattern = getPattern(bracket.endPattern)
  }
}

function getPattern(bracketPattern: string): RegExp {
  return new RegExp(startsWith(bracketPattern))
}
