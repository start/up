import { LINK, STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE, PARENTHESIZED, SQUARE_BRACKETED, ACTION } from './RichConventions'
import { RichConvention } from './RichConvention'
import { Token } from './Tokens/Token'
import { contextualizeTokens } from './TokenContextualization/contextualizeTokens'
import { ContextualizedToken } from './TokenContextualization/ContextualizedToken'
import { ContextualizedStartToken } from './TokenContextualization/ContextualizedStartToken'
import { ContextualizedEndToken } from './TokenContextualization/ContextualizedEndToken'


// Conventions can overlap, which makes it painful to produce an abstract syntax tree. This function rearranges
// and adds tokens to make that process simpler.
//
// Overlapping conventions are split into multiple pieces to ensure each piece has just a single parent.
export function nestOverlappingConventions(tokens: Token[]): Token[] {
  return new ConventionNester(tokens).tokens
}

// We're always okay with splitting these conventions.
const FREELY_SPLITTABLE_CONVENTIONS: RichConvention[] = [
  REVISION_DELETION,
  REVISION_INSERTION,
  STRESS,
  EMPHASIS,
  PARENTHESIZED,
  SQUARE_BRACKETED,
]

// We avoid splitting these conventions.
//
// The order is important: We'd rather split a link than a spoiler, and we'll never split a footnote.
const CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT = [
  LINK,
  ACTION,
  SPOILER,
  FOOTNOTE
]


class ConventionNester {
  tokens: Token[]

  private contextualizedTokens: ContextualizedToken[]

  // This class mutates the `tokens` argument!
  constructor(tokens: Token[]) {
    this.contextualizedTokens = contextualizeTokens(tokens)

    const splittableConventions =
      FREELY_SPLITTABLE_CONVENTIONS.slice()

    this.splitConventionsThatStartInsideAnotherConventionAndEndAfter(
      splittableConventions)

    for (const conventionNotToSplit of CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT) {
      this.resolveOverlapping(splittableConventions, conventionNotToSplit)

      // We'd rather split the current convention than the ones that follow. 
      splittableConventions.push(conventionNotToSplit)
    }

    this.tokens = this.contextualizedTokens.map(token => token.originalToken)
  }

  // Massages convention tokens into a tree structure while preserving any overlapping conveyed by the author. This
  // method assumes no tokens are missing.
  splitConventionsThatStartInsideAnotherConventionAndEndAfter(conventions: RichConvention[]): void {
    const unclosedStartTokens: ContextualizedStartToken[] = []

    // Here's our overall strategy:
    //
    // We'll to traverse our token array, keeping track of which conventions are still unclosed as of the current
    // position. Once we reach a convention end token, we check whether any still-unclosed conventions were opened
    // inside the current convention. If so, we essentially chop those conventions in half: We add end tokens
    // immediately before the end of the current convention, and we add corresponding start tokens immediately
    // after the end of the current convention.
    for (let tokenIndex = 0; tokenIndex < this.contextualizedTokens.length; tokenIndex++) {
      const token = this.contextualizedTokens[tokenIndex]

      if (doesTokenStartConvention(token, conventions)) {
        unclosedStartTokens.push(token)
        continue
      }

      if (!doesTokenEndConvention(token, conventions)) {
        continue
      }

      // Alright, we've found a token that closes one of our unclosed start tokens. If any conventions were opened
      // between this end token and its corresponding start token, those conventions overlap this one and will need
      // to be chopped in half.

      let endTokensOfOverlappingConventions: ContextualizedEndToken[] = []

      // We'll check the unclosed start tokens from most recently opened to least recently opened.
      for (let i = unclosedStartTokens.length - 1; i >= 0; i--) {
        const unclosedStartToken = unclosedStartTokens[i]

        if (unclosedStartToken.end === token) {
          // Hooray! We've reached the convention that is closed by the current token.
          unclosedStartTokens.splice(i, 1)

          // Any conventions opened before this one don't overlap with the current convention, so we can bail.
          break
        }

        endTokensOfOverlappingConventions.push(unclosedStartToken.end)
      }

      // Okay, now we know which conventions overlap the one that's about to close. To preserve overlapping
      // while making it easier to produce an abstract syntax tree, we make the following changes:
      //
      // 1. Just before the end token of the current convention, we add a closing token for each unclosed
      //    convention. To preserve proper nesting, we close the conventions in order of most to least recent.
      //  
      // 2. Just after the end token of the current convention, we add a start token for each unclosed convention.
      //    To avoid producing a surprising syntax tree, we re-open the conventions in their original order.
      this.closeAndReopenConventionsAroundTokenAtIndex(tokenIndex, endTokensOfOverlappingConventions)

      const countOverlapping = endTokensOfOverlappingConventions.length

      // Advance index to reflect the fact that we just added tokens
      tokenIndex += (2 * countOverlapping)
    }
  }

  // This method assumes that any `conventionsToSplit` tokens are already properly nested within each other.
  private resolveOverlapping(splittableConventions: RichConvention[], conventionNotToSplit: RichConvention): void {

    // To keep local variable names shorter, we'll refer to `cconventionNotToSplit` as the hero convention.

    for (let tokenIndex = 0; tokenIndex < this.contextualizedTokens.length; tokenIndex++) {
      const potentialHeroStartToken = this.contextualizedTokens[tokenIndex]

      const isStartTokenForHeroConvention =
        potentialHeroStartToken instanceof ContextualizedStartToken
        && potentialHeroStartToken.originalToken instanceof conventionNotToSplit.StartTokenType

      if (!isStartTokenForHeroConvention) {
        continue
      }

      const heroStartIndex = tokenIndex
      let heroEndIndex: number

      for (let i = heroStartIndex + 1; i < this.contextualizedTokens.length; i++) {
        const potentialHeroEndToken = this.contextualizedTokens[i]

        const isEndTokenForHeroConvention =
          potentialHeroEndToken instanceof ContextualizedEndToken
          && potentialHeroEndToken.originalToken instanceof conventionNotToSplit.EndTokenType

        if (isEndTokenForHeroConvention) {
          heroEndIndex = i
          break
        }
      }

      // Alright, we now know where this `cconventionNotToSplit` starts and ends. Any overlapping conventions
      // will either:

      // 1. Start before and end inside
      // 2. Start inside and end after

      const overlappingStartingBefore: ContextualizedEndToken[] = []
      const overlappingStartingInside: ContextualizedEndToken[] = []

      for (let indexInsideHero = heroStartIndex + 1; indexInsideHero < heroEndIndex; indexInsideHero++) {
        const token = this.contextualizedTokens[indexInsideHero]

        if (doesTokenStartConvention(token, splittableConventions)) {
          // Until we encounter the end token, we'll assume this token's convention overlaps.
          overlappingStartingInside.push(token.end)
          continue
        }

        if (doesTokenEndConvention(token, splittableConventions)) {
          // Because this function requires any conventions in `conventionsToSplit` to already be properly nested
          // into a treee structure, if there are any conventions that started inside `cconventionNotToSplit`,
          // the end token we've found must end the most recent one.
          if (overlappingStartingInside.length) {
            overlappingStartingInside.pop()
            continue
          }

          // Ahhh, so there were no conventions started inside this `cconventionNotToSplit`! That means this one
          // must have started before it.
          overlappingStartingBefore.push(token)
        }
      }

      this.closeAndReopenConventionsAroundTokenAtIndex(heroEndIndex, overlappingStartingInside)
      this.closeAndReopenConventionsAroundTokenAtIndex(heroStartIndex, overlappingStartingBefore)

      // Each convention we split in half generates two new additional tokens.
      const countTokensAdded = (2 * overlappingStartingBefore.length) + (2 * overlappingStartingInside.length)

      tokenIndex = heroEndIndex + countTokensAdded
    }
  }

  // The purpose of this method is best explained in the `nestFreelySplittableConventions` method.
  // In short, it chops conventions in two around the token at `index`, allowing conventions to be nested
  // properly (in a tree structure) while preserving the overlapping intended by the author.
  //
  // Functionally, this method does exactly what its name implies: it adds convention end tokens before `index`
  // and convention start tokens after `index`.
  private closeAndReopenConventionsAroundTokenAtIndex(index: number, endTokensFromMostRecentToLeast: ContextualizedEndToken[]): void {
    const contextualizedStartTokens =
      endTokensFromMostRecentToLeast
        .map(convention => convention.start)
        .reverse()

    this.insertTokens(index + 1, contextualizedStartTokens)
    this.insertTokens(index, endTokensFromMostRecentToLeast)
  }

  private insertTokens(index: number, contextualizedTokens: ContextualizedToken[]): void {
    this.contextualizedTokens.splice(index, 0, ...contextualizedTokens)
  }
}

function doesTokenStartConvention(token: ContextualizedToken, conventions: RichConvention[]): token is ContextualizedStartToken {
  return (
    token instanceof ContextualizedStartToken
    && conventions.some(convention => token.originalToken instanceof convention.StartTokenType))
}

function doesTokenEndConvention(token: ContextualizedToken, conventions: RichConvention[]): token is ContextualizedEndToken {
  return (
    token instanceof ContextualizedEndToken
    && conventions.some(convention => token.originalToken instanceof convention.EndTokenType))
}
