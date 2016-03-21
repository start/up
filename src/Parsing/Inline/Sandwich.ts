import { Token, TokenMeaning } from './Token'

export class Sandwich {
  public lastStartIndex: number
  public isUnclosed = false
  
  constructor (public bun: string, private start: TokenMeaning, private end: TokenMeaning) { }
  
  registerBunAndGetMeaning(index: number): TokenMeaning {
    this.lastStartIndex = index
    let meaning = (this.isUnclosed ? this.end : this.start)
    this.isUnclosed = !this.isUnclosed
    
    return meaning
  }
}