import { Token, TokenMeaning } from './Token'
import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { RichSandwich } from './RichSandwich'
import { TokenizerState } from './TokenizerState'

export class RichSandwichTracker {
  private statesBeforeIncompleteSandwich: TokenizerState[] = []
  
  constructor (public sandwich: RichSandwich) { }
  
  registerPotentialSandwich(state: TokenizerState): void {
    this.statesBeforeIncompleteSandwich.push(state)  
  }
  
  registerCompleteSandwich(): void {
    this.statesBeforeIncompleteSandwich.pop()
  }
  
  isAnySandwichOpen(): boolean {
    return this.statesBeforeIncompleteSandwich.length > 0
  }
  
  stateBeforeFirstFailure(): TokenizerState {
    return this.statesBeforeIncompleteSandwich[0]
  }
  
  reset(): void {
    this.statesBeforeIncompleteSandwich = []
  }
}