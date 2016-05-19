import { RichConvention } from './RichConvention'
import { Token } from './Tokens/Token'
import { getConventionEndedBy } from './getConventionEndedBy'
import { getConventionStartedBy } from './getConventionStartedBy'

import { LINK, STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE } from './RichConventions'

const RICH_CONVENTIONS = [LINK, STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE]

export function contextualizeTokens(tokens: Token[]): Token[] {
  for (let i = 0; i < tokens.length; i++) {
    
  }
  
  return null
}

abstract class ContextualizedToken {
  constructor(public token: Token, public index: number) { }
}

abstract class ContextualizedStartToken extends ContextualizedToken {
  endToken: Token
}

abstract class ContextualizedEndToken extends ContextualizedToken {
  startToken: Token
}
