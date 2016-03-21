import { Token, TokenMeaning } from './Token'

export class Sandwich {
  constructor (public bun: string, public start: TokenMeaning, public end: TokenMeaning) { }
}