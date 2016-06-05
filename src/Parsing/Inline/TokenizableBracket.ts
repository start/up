import { TokenizerGoal } from './TokenizerGoal'
import { Bracket } from './Bracket'
import { getRegExpStartingWith } from '../../Patterns'

export class TokenizableBracket {
  goal: TokenizerGoal
  startPattern: RegExp
  endPattern: RegExp

  constructor(args: { goal: TokenizerGoal, bracket: Bracket }) {
    const { goal, bracket } = args
    
    this.goal = goal
    this.startPattern = getRegExpStartingWith(bracket.startPattern)
    this.endPattern = getRegExpStartingWith(bracket.endPattern)
  }
}