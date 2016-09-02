import { TokenMeaning } from '../TokenMeaning'
import { ParseableToken } from '../ParseableToken'


export class Token implements ParseableToken {
  correspondingDelimiter: Token

  constructor(
    public meaning: TokenMeaning,
    public value?: string) { }

  // Associates a start token with an end token. This helps us handle overlapping
  enclosesContentBetweenItselfAnd(correspondingDelimiter: Token): void {
    this.correspondingDelimiter = correspondingDelimiter
    correspondingDelimiter.correspondingDelimiter = this
  }
}
