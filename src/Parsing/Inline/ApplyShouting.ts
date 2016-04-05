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
  
  // As implied above, we only care about plain text tokens, shouting placeholder tokens, and inline code
  // tokens. 
  const relevantIndexedTokens =
      tokens
        .filter(token => RELEVANT_TOKEN_MEANINGS.indexOf(token.meaning) !== -1)
        .map((token, index) => new IndexedToken(token, index))
        
  for (let i = 0; i < relevantIndexedTokens.length; i++) {
    const indexedToken = relevantIndexedTokens[i]
    
    if (indexedToken.token.meaning !== TokenMeaning.ShoutingPlaceholder) {
      // We only need to analyze the placeholder tokens
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
    }
    
    
    let potentialPurpose: PotentialPurpose
  }
  
  return tokens
}

function tokenCouldHaveWhitespace(indexedToken: IndexedToken): boolean {
  return indexedToken && (indexedToken.token.meaning === TokenMeaning.PlainText)
}

class ShoutingApplier {
  public relevantTokensAndOriginalIndexes: IndexedToken[]
  public tokens: Token[]

  constructor(tokens: Token[]) {
    this.relevantTokensAndOriginalIndexes =
      tokens
        .filter(token => RELEVANT_TOKEN_MEANINGS.indexOf(token.meaning) !== -1)
        .map((token, index) => new IndexedToken(token, index))

    let isEmphasized = false
    let isStressed = false

    for (let i = 0; i < this.relevantTokensAndOriginalIndexes.length; i++) {
      const canStartConvention = this.doesTokenPreceedNonWhitespace(i)
      const canEndConvention = this.doesTokenFollowNonWhitespace(i)
    }

    this.tokens = tokens
  }

  doesTokenPreceedNonWhitespace(index: number): boolean {
    return !this.doesTokenMatchWhitespacePattern(index + 1, /^\s/)
  }

  doesTokenFollowNonWhitespace(index: number): boolean {
    return !this.doesTokenMatchWhitespacePattern(index - 1, /\s$/)
  }

  doesTokenMatchWhitespacePattern(index: number, pattern: RegExp): boolean {
    if ((index < 0) || (index >= this.relevantTokensAndOriginalIndexes.length)) {
      return false
    }

    const {meaning, value} = this.relevantTokensAndOriginalIndexes[index].token

    return (meaning === TokenMeaning.PlainText) && pattern.test(value)
  }
}

function placeholderRepresentsEmphasis(token: Token): boolean {
  return token.value.length === 1
}

function placeholderRepresentsStress(token: Token): boolean {
  return token.value.length === 2
}

function placeholderRepresentsStressAndEmphasis(token: Token): boolean {
  return token.value.length > 2
}
