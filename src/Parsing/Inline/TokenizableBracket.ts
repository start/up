import { TokenizerGoal } from './TokenizerGoal'
import { Bracket } from './Bracket'

export class TokenizableBracket {
  constructor(public goal: TokenizerGoal, public bracket: Bracket) { }
}