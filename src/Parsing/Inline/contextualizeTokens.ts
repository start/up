import { RichConvention } from './RichConvention'
import { Token } from './Tokens/Token'
import { getConventionEndedBy } from './getConventionEndedBy'
import { getConventionStartedBy } from './getConventionStartedBy'

import { LINK, STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE } from './RichConventions'

const RICH_CONVENTIONS = [LINK, STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE]

export function contextualizeTokens(tokens: Token[]): ContextualizedToken[] {
  const resultTokens: ContextualizedToken[] = []
  const openStartTokens: ContextualizedStartToken[] = []
  
  for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
    const token = tokens[tokenIndex]
    
    const conventionStartedByToken = getConventionStartedBy(token, RICH_CONVENTIONS)
    
    if (conventionStartedByToken) {
      const startToken = new ContextualizedStartToken(token, conventionStartedByToken, tokenIndex)
      resultTokens.push(startToken)
      openStartTokens.push(startToken)
      continue
    }
    
    const conventionEndedByToken = getConventionEndedBy(token, RICH_CONVENTIONS)
    
    if (conventionEndedByToken) {
      resultTokens.push(new ContextualizedEndToken(token, conventionEndedByToken, tokenIndex))
      
      for (let i = openStartTokens.length - 1; i >= 0; i--) {
        const startToken = openStartTokens[i]
        
        if (token instanceof startToken.convention.EndTokenType) {
          openStartTokens.splice(i, 1)
          break
        }
      }
      
      continue
    }
    
    resultTokens.push(new ContextualizedToken(token))
  }
  
  return resultTokens
}


class ContextualizedToken {
  constructor(public token: Token) { }
}


class ContextualizedStartToken extends ContextualizedToken {
  end: ContextualizedEndToken
  
  constructor(public token: Token, public convention: RichConvention, public index: number) {
    super(token)
  }
}


class ContextualizedEndToken extends ContextualizedToken {
  start: ContextualizedStartToken
  
  constructor(public token: Token, public convention: RichConvention, public index: number) {
    super(token)
  }
}
