import { Token, TokenMeaning } from './Token'
import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { RichSandwich } from './RichSandwich'
import { TokenizerState } from './TokenizerState'

export class RichSandwichTracker {
  private unsatisfiedStates: TokenizerState[] = []
  
  constructor (public sandwich: RichSandwich) { }
  
  registerSandwichStart(state: TokenizerState): void {
    this.unsatisfiedStates.push(state)  
  }
  
  registerSandwichEnd(): void {
    this.unsatisfiedStates.pop()
  }
  
  isAnySandwichOpen(): boolean {
    return this.unsatisfiedStates.length > 0
  }
  
  firstUnsatisfiedState(): TokenizerState {
    return this.unsatisfiedStates[0]
  }
  
  clone() {
    const clone = new RichSandwichTracker(this.sandwich)
    clone.unsatisfiedStates = this.unsatisfiedStates.slice()
    
    return clone
  }
}