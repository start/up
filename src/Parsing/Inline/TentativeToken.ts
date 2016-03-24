import { TokenizerState } from './TokenizerState'
import { Token } from './Token'

export class TentativeToken {
  constructor(public token: Token, public stateBeforeToken?: TokenizerState) { }
}