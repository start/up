import { RichConvention } from '../RichConvention'
import { Token } from '../Tokens/Token'
import { ContextualizedToken } from './ContextualizedToken'
import { ContextualizedStartToken } from './ContextualizedStartToken'


export class ContextualizedEndToken extends ContextualizedToken {
  start: ContextualizedStartToken
  
  constructor(public originalToken: Token, public convention: RichConvention) {
    super(originalToken)
  }
}
