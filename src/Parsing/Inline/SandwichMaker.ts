import { Sandwich } from './Sandwich'
import { Token, TokenMeaning } from './Token'

export class SandwichMaker {
  public lastStartIndex: number
  public isUnclosed = false
  
  constructor (public sandwich: Sandwich) { }
  
  registerBunAndGetMeaning(index: number): TokenMeaning {
    this.lastStartIndex = index
    let meaning = (this.isUnclosed ? this.sandwich.end : this.sandwich.start)
    this.isUnclosed = !this.isUnclosed
    
    return meaning
  }
}