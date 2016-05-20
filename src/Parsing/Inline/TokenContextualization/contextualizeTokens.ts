import { RichConvention } from '../RichConvention'
import { Token } from '../Tokens/Token'
import { getConventionEndedBy } from './getConventionEndedBy'
import { getConventionStartedBy } from './getConventionStartedBy'
import { ContextualizedToken } from './ContextualizedToken'
import { ContextualizedStartToken } from './ContextualizedStartToken'
import { ContextualizedEndToken } from './ContextualizedEndToken'

import { LINK, STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE } from '../RichConventions'

const RICH_CONVENTIONS = [LINK, STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE]

export function contextualizeTokens(tokens: Token[]): ContextualizedToken[] {
  const resultTokens: ContextualizedToken[] = []
  const openStartTokens: ContextualizedStartToken[] = []
  
  for (const token of tokens) {
    const conventionStartedByToken = getConventionStartedBy(token, RICH_CONVENTIONS)
    
    if (conventionStartedByToken) {
      const startToken = new ContextualizedStartToken(token, conventionStartedByToken)
      resultTokens.push(startToken)
      openStartTokens.push(startToken)
      continue
    }
    
    const conventionEndedByToken = getConventionEndedBy(token, RICH_CONVENTIONS)
    
    if (conventionEndedByToken) {
      const endToken = new ContextualizedEndToken(token, conventionEndedByToken)
      resultTokens.push(endToken)
      
      // Now, let's find the matching open start token.
      //
      // The most recent open start token ended by the current token is guaranteed to be the one that matches.
      for (let i = openStartTokens.length - 1; i >= 0; i--) {
        const startToken = openStartTokens[i]
        
        if (token instanceof startToken.convention.EndTokenType) {
          // We found our match!
          
          // First, let's link the two together. 
          startToken.end = endToken
          endToken.start = startToken
          
          // Now, mark the start token as closed by removing it from the list of open start tokens.
          //
          // Please note that the start token is still in the list of result tokens, so we aren't destroying it.
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