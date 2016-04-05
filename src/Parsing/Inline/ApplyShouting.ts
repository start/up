import { Token, TokenMeaning } from './Token'
import { STRESS, EMPHASIS, SHOUTING_EMPHASIS, SHOUTING_STRESS } from './Sandwiches'

class TokenAndOriginalIndex {
  constructor(public token: Token, public originalIndex: number) { }
}

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
  return new ShoutingApplier(tokens).tokens
}

const RELEVANT_TOKEN_MEANINGS = [
  TokenMeaning.PlainText,
  TokenMeaning.ShoutingPlaceholder,
  TokenMeaning.InlineCode
]

class ShoutingApplier {
  public relevantTokensAndOriginalIndexes: TokenAndOriginalIndex[]
  public tokens: Token[]

  constructor(tokens: Token[]) {
    this.relevantTokensAndOriginalIndexes =
      tokens
        .filter(token => RELEVANT_TOKEN_MEANINGS.indexOf(token.meaning) !== -1)
        .map((token, index) => new TokenAndOriginalIndex(token, index))

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
