import { escapeForRegex } from '../../PatternHelpers'


export class Bracket {
  startPattern: string
  endPattern: string

  constructor(public open: string, public close: string) {
    this.startPattern = escapeForRegex(open)
    this.endPattern = escapeForRegex(close)
  }
}
