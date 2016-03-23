import { Token, TokenMeaning } from './Token'
import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { RichSandwich } from './RichSandwich'
import { TokenizerState } from './TokenizerState'

export class RichSandwichTracker {
  private stateBeforeIncompleteSandwich: TokenizerState[] = []
  
  constructor (public sandwich: RichSandwich) { }
  
  registerPotentialSandwich(state: TokenizerState): void {
    this.stateBeforeIncompleteSandwich.push(state)  
  }
  
  registerCompleteSandwich(): void {
    this.stateBeforeIncompleteSandwich.pop()
  }
  
  isAnySandwichOpen(): boolean {
    return this.stateBeforeIncompleteSandwich.length > 0
  }
  
  stateBeforeFirstIncompleteSandwich(): TokenizerState {
    return this.stateBeforeIncompleteSandwich[0]
  }
}