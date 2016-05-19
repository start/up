import { RichConvention } from './RichConvention'
import { Token } from './Tokens/Token'
import { getConventionEndedBy } from './getConventionEndedBy'
import { getConventionStartedBy } from './getConventionStartedBy'

import { LINK, STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE } from './RichConventions'

const RICH_CONVENTIONS = [LINK, STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE]

export function contextualizeTokens(tokens: Token[]): Token[] {
  const resultTokens: ContextualizedToken[] = []
  
  for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
    const token = tokens[tokenIndex]
    
    const conventionStartedByToken = getConventionStartedBy(token, RICH_CONVENTIONS)
    
    if (conventionStartedByToken) {
      resultTokens.push(new ContextualizedStartToken(token, tokenIndex))
      continue
    }
    
    const conventionEndedByToken = getConventionEndedBy(token, RICH_CONVENTIONS)
    
    if (conventionStartedByToken) {
      resultTokens.push(new ContextualizedEndToken(token, tokenIndex))
      continue
    }
    
    resultTokens.push(new ContextualizedToken(token))
  }
  
  return null
}


class ContextualizedToken {
  constructor(public token: Token) { }
}


class ContextualizedStartToken extends ContextualizedToken {
  end: ContextualizedEndToken
  
  constructor(public token: Token, public index: number) {
    super(token)
  }
}


class ContextualizedEndToken extends ContextualizedToken {
  start: ContextualizedStartToken
  
  constructor(public token: Token, public index: number) {
    super(token)
  }
}
