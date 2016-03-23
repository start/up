import { Token, TokenMeaning } from './Token'
import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { RichSandwich } from './RichSandwich'

export class RichSandwichTracker {
  private unclosedStartIndexes: number[] = []
  
  constructor (public sandwich: RichSandwich) { }
  
  registerStart(index: number): void {
    this.unclosedStartIndexes.push(index)  
  }
  
  registerEnd(): void {
    this.unclosedStartIndexes.pop()
  }
  
  hasAnyOpen(): boolean {
    return this.unclosedStartIndexes.length > 0
  }
  
  firstUnclosedStartIndex(): number {
    return this.unclosedStartIndexes[0]
  }
  
  clone() {
    const clone = new RichSandwichTracker(this.sandwich)
    clone.unclosedStartIndexes = this.unclosedStartIndexes.slice()
    
    return clone
  }
}