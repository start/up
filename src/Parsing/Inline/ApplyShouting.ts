import { Token, TokenMeaning } from './Token'
import { STRESS, EMPHASIS, SHOUTING_EMPHASIS, SHOUTING_STRESS } from './Sandwiches'

class TokenAndIndex {
  constructor(public token: Token, public index: number) { }
}

// This method examines the shouting placeholder tokens, determines the author's intent, and generates actual
// stress/emphasis tokens to reflect that intent.
export function applyShouting(tokens: Token[]): Token[] {
  return new ShoutingApplier(tokens).tokens
}

class ShoutingApplier {
  constructor(public tokens: Token[]) {
    const relevantTokens =
      tokens
        .filter(token =>
          token.meaning === TokenMeaning.PlainText || token.meaning === TokenMeaning.ShoutingPlaceholder)
        .map((token, index) =>
          new TokenAndIndex(token, index))
  }

  // For the purposes of shouting, the beginning and end of the string both count as whitespace. 
  surroundedByWhitespace(index: number) {
    return this.preceededByWhitespace(index) && this.followedByWhitespace(index)
  }

  followedByWhitespace(index: number): boolean {
    if (index >= this.tokens.length) {
      return true
    }

    const {meaning, value} = this.tokens[index + 1]

    return (
      meaning === TokenMeaning.PlainText
      && /^\s/.test(value)
    )
  }

  preceededByWhitespace(index: number): boolean {
    if (index < 0) {
      return true
    }

    const {meaning, value} = this.tokens[index + 1]

    return (
      meaning === TokenMeaning.PlainText
      && /\s$/.test(value)
    )
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