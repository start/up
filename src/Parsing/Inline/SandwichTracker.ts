import { Token, TokenMeaning } from './Token'
import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { Sandwich } from './Sandwich'

export class SandwichTracker {
  private unclosedStartIndexes: number[] = []
  
  constructor (public sandwich: Sandwich) { }
  
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
}