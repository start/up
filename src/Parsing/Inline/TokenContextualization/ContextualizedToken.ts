import { RichConvention } from '../RichConvention'
import { Token } from '../Tokens/Token'


export class ContextualizedToken {
  constructor(public originalToken: Token) { }
}