import { TokenizerGoal } from './TokenizerGoal'
import { Bracket } from './Bracket'

export class TokenizableRawTextBracket {
  constructor(public goal: TokenizerGoal, public bracket: Bracket) { }
}