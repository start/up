import { RichConvention } from './RichConvention'
import { Token } from './Tokens/Token'

import { LINK, STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE } from './RichConventions'

const REGULAR_SANDWICHES = [
  REVISION_DELETION,
  REVISION_INSERTION,
  SPOILER,
  FOOTNOTE,
  STRESS,
  EMPHASIS
]


// TODO: Determing what to do about:
//
// 1. Footnotes inside of links
// 2. Footnotes overlapping with a spoiler


export function nestOverlappingConventions(tokens: Token[]): Token[] {
  return new ConventionNester(tokens.slice()).tokens
}

// Conventions can overlap, which makes it painful to produce an abstract syntax tree. This class rearranges
// and adds tokens to make that process simpler.
//
// Overlapping conventions are split into multiple pieces to ensure each piece has just a single parent. Links,
// however, must not be split into multiple pieces, which means any convention that overlaps with a link must
// be split instead.
class ConventionNester {

  // This class mutates the `tokens` argument!
  constructor(public tokens: Token[]) {
    this.massageSandwichesIntoTreeStructure()
    this.splitAnySandwichThatOverlapsWithLinks()
  }

  // Massages sandwich tokens into a tree structure while preserving any overlapping conveyed by the author. This
  // method completely ignores link tokens, and it assumes no tokens are missing.
  massageSandwichesIntoTreeStructure(): void {
    const unclosedSandwiches: RichConvention[] = []

    // Here's our overall strategy:
    //
    // We'll to traverse our token array, keeping track of which sandwiches are still unclosed as of the current
    // position. Once we reach a sandwich end token, we check whether any still-unclosed sandwhiches were opened
    // inside the current sandwich. If so, we essentially chop those sandwiches in half: We add end tokens
    // immediately before the end of the current sandwich, and we add corresponding start tokens immediately
    // after the end of the current sandwich.
    for (let tokenIndex = 0; tokenIndex < this.tokens.length; tokenIndex++) {
      const token = this.tokens[tokenIndex]

      const sandwichStartedByThisToken = getSandwichStartedByThisToken(token)

      if (sandwichStartedByThisToken) {
        unclosedSandwiches.push(sandwichStartedByThisToken)
        continue
      }

      const sandwichEndedByThisToken = getSandwichEndedByThisToken(token)

      if (!sandwichEndedByThisToken) {
        continue
      }

      // Alright, we've found a token that closes one of our unclosed sandwiches. If any other sandwiches were
      // opened between this token and its corresponding start token, those sandwiches overlap this one and will
      // need to be chopped in half.

      let overlappingFromMostRecentToLeast: RichConvention[] = []

      // We'll check the unclosed sandwiches from most recently opened to least recently opened.
      for (let sandwichIndex = unclosedSandwiches.length - 1; sandwichIndex >= 0; sandwichIndex--) {
        const unclosedSandwich = unclosedSandwiches[sandwichIndex]

        if (unclosedSandwich === sandwichEndedByThisToken) {
          // Hooray! We've reached the sandwich that is closed by the current token.
          unclosedSandwiches.splice(sandwichIndex, 1)

          // Any sandwiches opened before this one don't overlap with the current sandwich, so we can bail.
          break
        }

        overlappingFromMostRecentToLeast.push(unclosedSandwich)
      }

      // Okay, now we know which sandwiches overlap the one that's about to close. To preserve overlapping
      // while making it easier to produce an abstract syntax tree, we make the following changes:
      //
      // 1. Just before the end token of the current sandwich, we add a closing token for each unclosed
      //    sandwich. To preserve proper nesting, we close the sandwiches in order of most to least recent.
      //  
      // 2. Just after the end token of the current sandwich, we add a start token for each unclosed sandwich.
      //    To avoid producing a surprising syntax tree, we re-open the sandwiches in their original order.
      this.closeAndReopenSandwichesAroundTokenAtIndex(tokenIndex, overlappingFromMostRecentToLeast)

      const countOverlapping = overlappingFromMostRecentToLeast.length

      // Advance index to reflect the fact that we just added tokens
      tokenIndex += (2 * countOverlapping)
    }
  }

  // This function assumes that any sandwich tokens are already properly nested.
  private splitAnySandwichThatOverlapsWithLinks(): void {
    for (let tokenIndex = 0; tokenIndex < this.tokens.length; tokenIndex++) {
      if (!(this.tokens[tokenIndex] instanceof LINK.StartTokenType)) {
        continue
      }

      const linkStartIndex = tokenIndex
      let linkEndIndex: number

      for (let i = linkStartIndex + 1; i < this.tokens.length; i++) {
        if (this.tokens[i] instanceof LINK.EndTokenType) {
          linkEndIndex = i
          break
        }
      }

      // Alright, we now know where this link starts and ends. Any overlapping sandwiches will either:

      // 1. Start before the link and end inside the link
      // 2. Start inside the link and end after the link

      const overlappingStartingBefore: RichConvention[] = []
      const overlappingStartingInside: RichConvention[] = []

      for (let insideLinkIndex = linkStartIndex + 1; insideLinkIndex < linkEndIndex; insideLinkIndex++) {
        const token = this.tokens[insideLinkIndex]
        const sandwichStartedByThisToken = getSandwichStartedByThisToken(token)

        if (sandwichStartedByThisToken) {
          // Until we encounter the end token, we'll assume this sandwich overlaps.
          overlappingStartingInside.push(sandwichStartedByThisToken)
          continue
        }

        const sandwichEndedByThisToken = getSandwichEndedByThisToken(token)

        if (sandwichEndedByThisToken) {
          // This function assumes any sandwich conventions are already properly nested into a treee
          // structure. Therefore, if there are any sandwich sonventions that started inside the link,
          // this one must be the most recent.
          if (overlappingStartingInside.length) {
            overlappingStartingInside.pop()
            continue
          }

          // Ahhh, but there were no sandwiches started inside this link! That means this one must have
          // started before it.
          overlappingStartingBefore.push(sandwichEndedByThisToken)
        }
      }

      this.closeAndReopenSandwichesAroundTokenAtIndex(linkEndIndex, overlappingStartingInside)
      this.closeAndReopenSandwichesAroundTokenAtIndex(linkStartIndex, overlappingStartingBefore)

      // Each sandwich we split in half generates two new additional tokens.
      const countTokensAdded = (2 * overlappingStartingBefore.length) + (2 * overlappingStartingInside.length)

      tokenIndex = linkEndIndex + countTokensAdded
    }
  }

  // The purpose of this method is best explained in the `massageSandwichesIntoTreeStructure` method.
  // In short, it chops sandwiches in two around the token at `index`, allowing sandwiches to be nested
  // properly (in a tree structure) while preserving the overlapping intended by the author.
  //
  // Functionally, this method does exactly what its name implies: it adds sandwich end tokens before `index`
  // and sandwich start tokens after `index`.
  private closeAndReopenSandwichesAroundTokenAtIndex(index: number, sandwichesInTheOrderTheyShouldClose: RichConvention[]): void {
    const startTokensToAdd =
      sandwichesInTheOrderTheyShouldClose
        .map(sandwich => new sandwich.StartTokenType())
        .reverse()

    const endTokensToAdd =
      sandwichesInTheOrderTheyShouldClose
        .map(sandwich => new sandwich.EndTokenType())

    this.insertTokens(index + 1, startTokensToAdd)
    this.insertTokens(index, endTokensToAdd)
  }
  
  private insertTokens(index: number, tokens: Token[]): void {
    this.tokens.splice(index, 0, ...tokens)
  }
}

function getSandwichStartedByThisToken(token: Token): RichConvention {
  return REGULAR_SANDWICHES.filter(sandwich =>
    token instanceof sandwich.StartTokenType
  )[0]
}

function getSandwichEndedByThisToken(token: Token): RichConvention {
  return REGULAR_SANDWICHES.filter(sandwich =>
    token instanceof sandwich.EndTokenType
  )[0]
}
