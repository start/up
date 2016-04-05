import { Token, TokenMeaning } from './Token'
import { STRESS, EMPHASIS, SHOUTING_EMPHASIS, SHOUTING_STRESS } from './Sandwiches'

class IndexedToken {
  constructor(public token: Token, public originalIndex: number) { }
}

enum PotentialPurpose {
  OpenConvention,
  CloseConvention,
  OpenOrCloseConvention
}

class PotentialShoutingToken {
  constructor(public value: string, potentialPurpose: PotentialPurpose) { }
}

const RELEVANT_TOKEN_MEANINGS = [
  TokenMeaning.PlainText,
  TokenMeaning.ShoutingPlaceholder,
  TokenMeaning.InlineCode
]

// This method examines the shouting placeholder tokens, determines the author's intent, and generates actual
// stress/emphasis tokens to reflect that intent.
//
// Stress and emphasis can only be started by asterisks immediately followed by non-whitespace, and both can
// only be ended by asterisks immediadly following whitespace:
//
// This is *emphasized*
// This is empha*size*d, too
//
// Inline code always counts as non-whitespace, but other token types are completely ignored. It doesn't
// matter if they get in between the asterisks and any non-whitespace:
//
// *++This is emphasized++*

export function applyShouting(tokens: Token[]): Token[] {
  tokens = tokens.slice()
  
  // As mentioned above, we can ignore most token types.
  const relevantIndexedTokens =
      tokens
        .filter(token => RELEVANT_TOKEN_MEANINGS.indexOf(token.meaning) !== -1)
        .map((token, index) => new IndexedToken(token, index))
        
  // Let's collect the potential shouting tokens, as well as the potential purpose of each
  const potentialShoutingTokens: PotentialShoutingToken[] = []
        
  for (let i = 0; i < relevantIndexedTokens.length; i++) {
    const indexedToken = relevantIndexedTokens[i]
    
    if (indexedToken.token.meaning !== TokenMeaning.ShoutingPlaceholder) {
      // We only need to analyze the placeholder tokens themselves (though ) 
      continue  
    }
    
    const prev = relevantIndexedTokens[i - 1]
    const next = relevantIndexedTokens[i + 1]
    
    let isFollowedByWhitespace = tokenCouldHaveWhitespace(next) && /^\s/.test(next.token.value)
    let isPrecededByWhitespace = tokenCouldHaveWhitespace(prev) && /\s$/.test(next.token.value)
    
    if (isPrecededByWhitespace && isFollowedByWhitespace) {
        // If asterisks are in the middle whitespace, they're treated as plain text. Demoted!
        //
        // The`relevantIndexedTokens` collection actually stores references to the original tokens, so
        // we've modified the contents of the original collection.
        indexedToken.token.meaning = TokenMeaning.PlainText
        continue
    }
    
    let potentialPurpose: PotentialPurpose
    
    if (!isPrecededByWhitespace && !isFollowedByWhitespace) {
      potentialPurpose = PotentialPurpose.OpenOrCloseConvention
    } else if (!isPrecededByWhitespace) {
      potentialPurpose = PotentialPurpose.CloseConvention
    } else {
      potentialPurpose = PotentialPurpose.OpenConvention
    }
    
    potentialShoutingTokens.push(
      new PotentialShoutingToken(indexedToken.token.value, potentialPurpose)) 
  }
  
  return tokens
}

function getIndexedShoutingTokens(potentialShoutingTokens: PotentialShoutingToken[]): IndexedToken[] {
  return null
}

function tokenCouldHaveWhitespace(indexedToken: IndexedToken): boolean {
  return indexedToken && (indexedToken.token.meaning === TokenMeaning.PlainText)
}