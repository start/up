import { RichConvention } from './RichConvention'
import { Token } from './Tokens/Token'
import { getConventionEndedBy } from './getConventionEndedBy'
import { getConventionStartedBy } from './getConventionStartedBy'
import { ContextualizedToken } from './ContextualizedToken'
import { ContextualizedStartToken } from './ContextualizedStartToken'


export class ContextualizedEndToken extends ContextualizedToken {
  start: ContextualizedStartToken
  
  constructor(public token: Token, public convention: RichConvention, public index: number) {
    super(token)
  }
}
