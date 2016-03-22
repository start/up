import { Token, TokenMeaning } from './Token'
import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { RussianDoll } from './RussianDoll'

export class RussianDollTracker {
  private unclosedStartIndexes: number[] = []
  
  constructor (public russianDoll: RussianDoll) { }
  
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