import { LINK_CONVENTION, STRESS_CONVENTION, EMPHASIS_CONVENTION, REVISION_DELETION_CONVENTION, REVISION_INSERTION_CONVENTION, SPOILER_CONVENTION, NSFW_CONVENTION, NSFL_CONVENTION, FOOTNOTE_CONVENTION, PARENTHESIZED_CONVENTION, SQUARE_BRACKETED_CONVENTION, ACTION_CONVENTION } from '../RichConventions'
import { RichConvention } from '../RichConvention'
import { Token } from './Token'


// Conventions can overlap, which makes it painful to produce an abstract syntax tree. This function rearranges
// and adds tokens to make that process simpler.
//
// Overlapping conventions are split into multiple pieces to ensure each piece has just a single parent.
export function nestOverlappingConventions(tokens: Token[]): Token[] {
  return new ConventionNester(tokens).tokens
}

// We're always okay with splitting these conventions.
const FREELY_SPLITTABLE_CONVENTIONS: RichConvention[] = [
  REVISION_DELETION_CONVENTION,
  REVISION_INSERTION_CONVENTION,
  STRESS_CONVENTION,
  EMPHASIS_CONVENTION,
  PARENTHESIZED_CONVENTION,
  SQUARE_BRACKETED_CONVENTION
]

// We avoid splitting these conventions.
//
// The order is important: We'd rather split a link than a spoiler, and we'll never split a footnote.
const CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT = [
  LINK_CONVENTION,
  ACTION_CONVENTION,
  SPOILER_CONVENTION,
  NSFW_CONVENTION,
  NSFL_CONVENTION,
  FOOTNOTE_CONVENTION
]

const ALL_RICH_CONVENTIONS =
  [...FREELY_SPLITTABLE_CONVENTIONS, ...CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT]


class ConventionNester {
  constructor(public tokens: Token[]) {
    this.tokens = tokens.slice()

    const splittableConventions =
      FREELY_SPLITTABLE_CONVENTIONS.slice()

    this.splitConventionsThatStartInsideAnotherConventionAndEndAfter(
      splittableConventions)

    for (const conventionNotToSplit of CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT) {
      this.resolveOverlapping(splittableConventions, conventionNotToSplit)

      // We'd rather split the current convention than the ones that follow. 
      splittableConventions.push(conventionNotToSplit)
    }
  }

  splitConventionsThatStartInsideAnotherConventionAndEndAfter(conventions: RichConvention[]): void {
    const unclosedStartTokens: Token[] = []

    // Here's our overall strategy:
    //
    // We'll to traverse our token array, keeping track of which conventions are still unclosed as of the current
    // position. Once we reach a convention end token, we check whether any still-unclosed conventions were opened
    // inside the current convention. If so, we essentially chop those conventions in half: We add end tokens
    // immediately before the end of the current convention, and we add corresponding start tokens immediately
    // after the end of the current convention.
    for (let tokenIndex = 0; tokenIndex < this.tokens.length; tokenIndex++) {
      const token = this.tokens[tokenIndex]

      if (doesTokenStartAnyConvention(token, conventions)) {
        unclosedStartTokens.push(token)
        continue
      }

      if (!doesTokenEndAnyConvention(token, conventions)) {
        continue
      }

      // Alright, we've found a token that closes one of our unclosed start tokens. If any conventions were opened
      // between this end token and its corresponding start token, those conventions (overlapping this one) will
      // be chopped in half.
      const endToken = token

      // Why do we store a collection of end tokens rather than a collection of conventions?
      //
      // Link end tokens have a URL that needs to be copied when links are split in half. Right now, links aren't 
      // split using this method (and none of the conventions split using this method have any values in their end
      // tokens), but this method uses the same helper method used to split links.
      let endTokensOfOverlappingConventions: Token[] = []

      // We'll check the unclosed start tokens from most recently opened to least recently opened.
      for (let i = unclosedStartTokens.length - 1; i >= 0; i--) {
        const unclosedStartToken = unclosedStartTokens[i]

        if (unclosedStartToken.correspondsToToken === endToken) {
          // Hooray! We've reached the start token that is closed by the current token.
          unclosedStartTokens.splice(i, 1)

          // Any conventions opened before this one don't overlap with the current convention, so we can bail.
          break
        }

        endTokensOfOverlappingConventions.push(unclosedStartToken.correspondsToToken)
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

      // Advance index to reflect the fact that we just added tokens. We aded `countOverlapping` before `endToken`,
      // and `countOverlapping` start tokens before `endToken`.
      tokenIndex += (2 * countOverlapping)
    }
  }

  // This method assumes that any `conventionsToSplit` tokens are already properly nested within each other.
  private resolveOverlapping(splittableConventions: RichConvention[], conventionNotToSplit: RichConvention): void {

    // To keep local variable names shorter, we'll refer to `conventionNotToSplit` as the hero convention.

    for (let tokenIndex = 0; tokenIndex < this.tokens.length; tokenIndex++) {
      const potentialHeroStartToken = this.tokens[tokenIndex]

      const isStartTokenForHeroConvention =
        potentialHeroStartToken.kind === conventionNotToSplit.startTokenKind

      if (!isStartTokenForHeroConvention) {
        continue
      }

      const heroStartIndex = tokenIndex
      let heroEndIndex: number

      for (let i = heroStartIndex + 1; i < this.tokens.length; i++) {
        const potentialHeroEndToken = this.tokens[i]

        const isEndTokenForHeroConvention =
          potentialHeroEndToken === potentialHeroStartToken.correspondsToToken

        if (isEndTokenForHeroConvention) {
          heroEndIndex = i
          break
        }
      }

      // Alright, we now know where this `conventionNotToSplit` starts and ends. Any overlapping conventions will
      // either:
      //
      // 1. Start before and end inside
      // 2. Start inside and end after
      //
      // We'll keep track of both. However, we need to store tokens, not conventions, because link end tokens have
      // a URL that must be copied whenever links are split in half.
      //
      // Both collections contain end tokens in the order they appear in the original token collection (from inner
      // to outer). 
      const endTokensOfOverlappingConventionsStartingBefore: Token[] = []
      const endTokensOfOverlappingConventionsStartingInside: Token[] = []

      for (let indexInsideHero = heroStartIndex + 1; indexInsideHero < heroEndIndex; indexInsideHero++) {
        const innerToken = this.tokens[indexInsideHero]

        if (doesTokenStartAnyConvention(innerToken, splittableConventions)) {
          // Until we encounter the end token, we'll assume this start token's convention overlaps.
          //
          // We `unshift`, not `push`, because the collection represents end tokens in the order they appear, and
          // end tokens appear in the opposite order of start tokens.
          endTokensOfOverlappingConventionsStartingInside.unshift(innerToken.correspondsToToken)
          continue
        }

        if (doesTokenEndAnyConvention(innerToken, splittableConventions)) {
          // Because this function requires any conventions in `conventionsToSplit` to already be properly nested
          // into a treee structure, if there are any conventions that started inside `conventionNotToSplit`, the
          // end token we've found must end the most recent one. We `unshift` items into this collection, so the
          // most recent item is the first.
          if (endTokensOfOverlappingConventionsStartingInside.length) {
            endTokensOfOverlappingConventionsStartingInside.shift()
            continue
          }

          // Well, there were no unclosed conventions started inside this `conventionNotToSplit`. That means the
          // current end token's corresponding start token appeared before the hero's start token (and thus is
          // overlapping).
          endTokensOfOverlappingConventionsStartingBefore.push(innerToken)

        }
      }

      this.closeAndReopenConventionsAroundTokenAtIndex(heroEndIndex, endTokensOfOverlappingConventionsStartingInside)
      this.closeAndReopenConventionsAroundTokenAtIndex(heroStartIndex, endTokensOfOverlappingConventionsStartingBefore)
    }
  }

  // This method's purpose is best explained in the `splitConventionsThatStartInsideAnotherConventionAndEndAfter`
  // method.
  //
  // In short, it chops conventions in two around the token at `index`, allowing conventions to be nested
  // properly (in a tree structure) while preserving the overlapping intended by the author.
  //
  // Functionally, this method does exactly what its name implies: it adds convention end tokens before `index`
  // and convention start tokens after `index`.
  private closeAndReopenConventionsAroundTokenAtIndex(index: number, endTokensInTheirOriginalOrder: Token[]): void {
    const startTokensInTheirOriginalOrder =
      endTokensInTheirOriginalOrder
        .map(endToken => endToken.correspondsToToken)
        .reverse()

    this.insertTokens(index + 1, startTokensInTheirOriginalOrder)
    this.insertTokens(index, endTokensInTheirOriginalOrder)
  }

  private insertTokens(index: number, tokens: Token[]): void {
    this.tokens.splice(index, 0, ...tokens)
  }
}

function doesTokenStartAnyConvention(token: Token, conventions: RichConvention[]): boolean {
  return conventions.some(convention => token.kind === convention.startTokenKind)
}

function doesTokenEndAnyConvention(token: Token, conventions: RichConvention[]): boolean {
  return conventions.some(convention => token.kind === convention.endTokenKind)
}

function doesTokenSimplyDelimitConvention(token: Token, conventions: RichConvention[]): boolean {
  return conventions.some(convention =>
    (token.kind === convention.startTokenKind) || (token.kind === convention.endTokenKind))
}
