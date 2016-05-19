import { RichConvention } from './RichConvention'
import { Token } from './Tokens/Token'
import { getConventionEndedBy } from './getConventionEndedBy'
import { getConventionStartedBy } from './getConventionStartedBy'

import { LINK, STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE } from './RichConventions'

// Conventions can overlap, which makes it painful to produce an abstract syntax tree. This function rearranges
// and adds tokens to make that process simpler.
//
// Overlapping conventions are split into multiple pieces to ensure each piece has just a single parent.
export function nestOverlappingConventions(tokens: Token[]): Token[] {
  return new ConventionNester(tokens.slice()).tokens
}

// We're always okay with splitting these conventions.
const FREELY_SPLITTABLE_CONVENTIONS: RichConvention[] = [
  REVISION_DELETION,
  REVISION_INSERTION,
  STRESS,
  EMPHASIS
]

// We avoid splitting these conventions.
//
// The order is important: We'd rather split a link than a spoiler, and we'll never split a footnote.
const CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT = [
  LINK,
  SPOILER,
  FOOTNOTE
]


class ConventionNester {

  // This class mutates the `tokens` argument!
  constructor(public tokens: Token[]) {
    this.splitConventionsThatStartInsideAnotherConventionAndEndAfter(
      FREELY_SPLITTABLE_CONVENTIONS)
    
    const conventionsToSplit =
      FREELY_SPLITTABLE_CONVENTIONS
      
    for (const conventionNotToSplit of CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT) {
      this.resolveOverlapping(
        conventionsToSplit,
        conventionNotToSplit)
      
      // We'd rather split the current convention than the ones that follow. 
      conventionsToSplit.push(conventionNotToSplit)
    }
  }

  // Massages convention tokens into a tree structure while preserving any overlapping conveyed by the author. This
  // method assumes no tokens are missing.
  splitConventionsThatStartInsideAnotherConventionAndEndAfter(conventions: RichConvention[]): void {
    const unclosedConventions: RichConvention[] = []

    // Here's our overall strategy:
    //
    // We'll to traverse our token array, keeping track of which conventions are still unclosed as of the current
    // position. Once we reach a convention end token, we check whether any still-unclosed conventions were opened
    // inside the current convention. If so, we essentially chop those conventions in half: We add end tokens
    // immediately before the end of the current convention, and we add corresponding start tokens immediately
    // after the end of the current convention.
    for (let tokenIndex = 0; tokenIndex < this.tokens.length; tokenIndex++) {
      const token = this.tokens[tokenIndex]

      const conventionStartedByThisToken = getConventionStartedBy(token, conventions)

      if (conventionStartedByThisToken) {
        unclosedConventions.push(conventionStartedByThisToken)
        continue
      }

      const conventionEndedByThisToken = getConventionEndedBy(token, conventions)

      if (!conventionEndedByThisToken) {
        continue
      }

      // Alright, we've found a token that closes one of our unclosed conventions. If any other conventions were
      // opened between this token and its corresponding start token, those conventions overlap this one and will
      // need to be chopped in half.

      let overlappingFromMostRecentToLeast: RichConvention[] = []

      // We'll check the unclosed conventions from most recently opened to least recently opened.
      for (let conventionIndex = unclosedConventions.length - 1; conventionIndex >= 0; conventionIndex--) {
        const unclosedConvention = unclosedConventions[conventionIndex]

        if (unclosedConvention === conventionEndedByThisToken) {
          // Hooray! We've reached the convention that is closed by the current token.
          unclosedConventions.splice(conventionIndex, 1)

          // Any conventions opened before this one don't overlap with the current convention, so we can bail.
          break
        }

        overlappingFromMostRecentToLeast.push(unclosedConvention)
      }

      // Okay, now we know which conventions overlap the one that's about to close. To preserve overlapping
      // while making it easier to produce an abstract syntax tree, we make the following changes:
      //
      // 1. Just before the end token of the current convention, we add a closing token for each unclosed
      //    convention. To preserve proper nesting, we close the conventions in order of most to least recent.
      //  
      // 2. Just after the end token of the current convention, we add a start token for each unclosed convention.
      //    To avoid producing a surprising syntax tree, we re-open the conventions in their original order.
      this.closeAndReopenConventionsAroundTokenAtIndex(tokenIndex, overlappingFromMostRecentToLeast)

      const countOverlapping = overlappingFromMostRecentToLeast.length

      // Advance index to reflect the fact that we just added tokens
      tokenIndex += (2 * countOverlapping)
    }
  }

  // This method assumes that any `conventionsToSplit` tokens are already properly nested.
  private resolveOverlapping(conventionsToSplit: RichConvention[], conventionNotToSplit: RichConvention): void {
    for (let tokenIndex = 0; tokenIndex < this.tokens.length; tokenIndex++) {
      if (!(this.tokens[tokenIndex] instanceof conventionNotToSplit.StartTokenType)) {
        continue
      }
      
      // To keep variable names shorter, we'll refer to `cconventionNotToSplit` as the hero convention.

      const heroStartIndex = tokenIndex
      let heroEndIndex: number

      for (let i = heroStartIndex + 1; i < this.tokens.length; i++) {
        if (this.tokens[i] instanceof conventionNotToSplit.EndTokenType) {
          heroEndIndex = i
          break
        }
      }

      // Alright, we now know where this `cconventionNotToSplit` starts and ends. Any overlapping conventions
      // will either:

      // 1. Start before and end inside
      // 2. Start inside and end after

      const overlappingStartingBefore: RichConvention[] = []
      const overlappingStartingInside: RichConvention[] = []

      for (let indexInsideHero = heroStartIndex + 1; indexInsideHero < heroEndIndex; indexInsideHero++) {
        const token = this.tokens[indexInsideHero]
        const conventionStartedByThisToken = getConventionStartedBy(token, conventionsToSplit)

        if (conventionStartedByThisToken) {
          // Until we encounter the end token, we'll assume this convention overlaps.
          overlappingStartingInside.push(conventionStartedByThisToken)
          continue
        }

        const conventionEndedByThisToken = getConventionEndedBy(token, conventionsToSplit)

        if (conventionEndedByThisToken) {
          // This function assumes any conventions in `conventionsToSplit` are already properly nested
          // into a treee structure. Therefore, if there are any conventions that started inside
          // `cconventionNotToSplit`, this convention we've found must be the most recent.
          if (overlappingStartingInside.length) {
            overlappingStartingInside.pop()
            continue
          }

          // Ahhh, so there were no conventions started inside this `cconventionNotToSplit`! That means this one
          // must have started before it.
          overlappingStartingBefore.push(conventionEndedByThisToken)
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
  private closeAndReopenConventionsAroundTokenAtIndex(index: number, conventionsInTheOrderTheyShouldClose: RichConvention[]): void {
    const startTokensToAdd =
      conventionsInTheOrderTheyShouldClose
        .map(convention => new convention.StartTokenType())
        .reverse()

    const endTokensToAdd =
      conventionsInTheOrderTheyShouldClose
        .map(convention => new convention.EndTokenType())

    this.insertTokens(index + 1, startTokensToAdd)
    this.insertTokens(index, endTokensToAdd)
  }
  
  private insertTokens(index: number, tokens: Token[]): void {
    this.tokens.splice(index, 0, ...tokens)
  }
}
