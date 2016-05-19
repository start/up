import { RichConvention } from './RichConvention'
import { Token } from './Tokens/Token'
import { getConventionEndedBy } from './getConventionEndedBy'
import { getConventionStartedBy } from './getConventionStartedBy'
import { ContextualizedToken } from './ContextualizedToken'
import { ContextualizedEndToken } from './ContextualizedEndToken'


export class ContextualizedStartToken extends ContextualizedToken {
  end: ContextualizedEndToken
  
  constructor(public token: Token, public convention: RichConvention, public index: number) {
    super(token)
  }
}