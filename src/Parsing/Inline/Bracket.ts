import { TokenKind } from './TokenKind'
import { escapeForRegex } from '../../Patterns'


export class Bracket {
  startPattern: string
  endPattern: string

  constructor(public start: string, public end: string) {
    this.startPattern = escapeForRegex(start)
    this.endPattern = escapeForRegex(end)
  }
}