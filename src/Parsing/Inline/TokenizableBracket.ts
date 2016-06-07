import { TokenizerGoal } from './TokenizerGoal'
import { Bracket } from './Bracket'
import { regExpStartingWith } from '../../Patterns'


export class TokenizableBracket {
  goal: TokenizerGoal
  startPattern: RegExp
  endPattern: RegExp
  open: string
  close: string

  constructor(args: { goal: TokenizerGoal, bracket: Bracket }) {
    const { goal, bracket } = args
    
    this.goal = goal
    this.startPattern = regExpStartingWith(bracket.startPattern)
    this.endPattern = regExpStartingWith(bracket.endPattern)
    this.open = bracket.start
    this.close = bracket.end
  }
}