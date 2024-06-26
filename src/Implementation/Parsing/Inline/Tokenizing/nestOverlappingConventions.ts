import { ParseableToken } from '../ParseableToken'
import { BOLD, EMPHASIS, FOOTNOTE, HIGHLIGHT, INLINE_QUOTE, INLINE_REVEALABLE, ITALIC, LINK, NORMAL_PARENTHETICAL, SQUARE_PARENTHETICAL, STRESS } from '../RichConventions'
import { RichConvention } from './RichConvention'
import { Token } from './Token'


// Rich conventions can overlap, which makes it painful to produce an abstract syntax tree. This function
// rearranges and adds tokens to make that process simpler.
//
// Overlapping rich conventions are split into multiple pieces to ensure each piece has just a single parent.
//
// That being said, Up offers no real support for *self-overlapping* conventions. When a convention overlaps
// one or more instances of itself, the start/end delimiters are simply matched from innermost to outermost.
//
// For example, this:
//
//   This [SPOILER: does (SPOILER: not] make) much sense.
//
// ...should be parsed as though it were this:
//
//   This [SPOILER: does [SPOILER: not] make] much sense.
//
// Note the identical brackets in the second example.
//
// As mentioned above, in cases of self-overlapping, we want to match tokens from innermost to outermost.
// Therefore, in the first example, we want to match `(SPOILER:` with `]`.
//
// Luckily, we have an easy solution: Just leave the tokens alone!
//
// The `nestOverlappingConventions` function returns a `ParseableToken` collection. A `ParseableToken`
// simply has a role (e.g. `InlineRevealableStart`) and an optional value. Because they lack the
// `correspondingEnclosingToken` field, it's naturally impossible for them to express self-overlapping.
export function nestOverlappingConventions(tokens: Token[]): ParseableToken[] {
  return new ConventionNester(tokens).tokens
}


// We're always okay with splitting these conventions.
const FREELY_SPLITTABLE_CONVENTIONS: RichConvention[] = [
  EMPHASIS,
  STRESS,
  ITALIC,
  BOLD,
  HIGHLIGHT,
  NORMAL_PARENTHETICAL,
  SQUARE_PARENTHETICAL
]

// We avoid splitting these conventions.
//
// The order is important: We'd rather split a link than revealable content, and we'll never split a footnote.
const CONVENTIONS_TO_AVOID_SPLITTING_FROM_LEAST_TO_MOST_IMPORTANT = [
  LINK,
  INLINE_REVEALABLE,
  INLINE_QUOTE,
  FOOTNOTE
]


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
      // Because link end tokens have a URL that needs to be copied when links are split in half, and we need to
      // preserve that URL.
      //
      // Links aren't split using this method, but this method uses the same helper method used to split links.
      const endTokensOfOverlappingConventions: Token[] = []

      // We'll check the unclosed start tokens from most recently opened to least recently opened (from inner to
      // outer).
      for (let i = unclosedStartTokens.length - 1; i >= 0; i--) {
        const correspondingEnclosingToken = unclosedStartTokens[i].correspondingEnclosingToken!;



        // We want to see whether this start token matches our end token. Why aren't we just doing
        // `correspondingEnclosingToken === endToken`?
        //
        // Well, as explained in the comments above this class, we ignore self-overlapping conventions, instead
        // choosing to match their start/end tokens from innermost to outermost.
        //
        // Let's look at this example of one spoiler overlapping another:
        //
        //   This [SPOILER: does (SPOILER: not] make) much sense.
        //
        // The end token produced by `]` corresponds to the start token produced by `[SPOILER:`. By checking
        // only the `role` fields, we instead match `]` with `(SPOILER:`, ultimately ignoring that the
        // conventions are overlapping. Mission accomplished!
        if (correspondingEnclosingToken.role === endToken.role) {
          // Hooray! We've reached the start token that is closed by the current token.
          unclosedStartTokens.splice(i, 1)

          // Any conventions opened before this one don't overlap with the current convention, so we can bail.
          break
        }

        // Uh-oh. This start token belongs to an overlapping convention.
        endTokensOfOverlappingConventions.push(correspondingEnclosingToken)
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

      // Let's advance our token index to reflect the fact that we just added tokens. We added `countOverlapping`
      // end tokens before `endToken`, and `countOverlapping` start tokens after `endToken`.
      //
      // Before we added those tokens, `endToken` was sitting at `tokenIndex`. We don't need to revisit any of
      // the tokens we just added, so we want the next token we examine to be the token following the start
      // tokens we added after `endToken`.
      tokenIndex += (2 * countOverlapping)
    }
  }

  // This method assumes that any `splittableConventions` tokens are already properly nested within each other.
  //
  // By design, this method does not resolve self-overlapping! If `conventionNotToSplit` overlaps another
  // instance of itself, we do nothing about it. Please see the comment above this class for more information.
  private resolveOverlapping(splittableConventions: RichConvention[], conventionNotToSplit: RichConvention): void {
    // To keep local variable names shorter, we'll refer to `conventionNotToSplit` as the hero convention.

    for (let tokenIndex = 0; tokenIndex < this.tokens.length; tokenIndex++) {
      const potentialHeroStartToken = this.tokens[tokenIndex]

      const isStartTokenForHeroConvention =
        potentialHeroStartToken.role === conventionNotToSplit.startTokenRole

      if (!isStartTokenForHeroConvention) {
        continue
      }

      const heroStartIndex = tokenIndex

      for (let i = heroStartIndex + 1; i < this.tokens.length; i++) {
        const potentialHeroEndToken = this.tokens[i]

        const isEndTokenForHeroConvention =
          potentialHeroEndToken === potentialHeroStartToken.correspondingEnclosingToken

        if (isEndTokenForHeroConvention) {
          const heroEndIndex = i

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
              endTokensOfOverlappingConventionsStartingInside.unshift(innerToken.correspondingEnclosingToken!)
              continue
            }

            if (doesTokenEndAnyConvention(innerToken, splittableConventions)) {
              // Because this function requires any conventions in `conventionsToSplit` to already be properly nested
              // into a tree structure, if there are any conventions that started inside `conventionNotToSplit`, the
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

          break
        }
      }
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
    // We're going to close and reopen the innermost conventions first (those belonging to end tokens appearing
    // earlier in `endTokensInTheirOriginalOrder`.
    //
    // Before adding a new end token, we examine the token that would directly precede it. If that token is the
    // corresponding start token, rather than create an empty convention, we simply remove that start token.
    //
    // Before adding a new start token, we examine the token that would directly follow it. If that token is the
    // corresponding end token, rather than create an empty convention, we simply remove that end token.

    const { tokens } = this

    for (const endToken of endTokensInTheirOriginalOrder) {
      const startToken = endToken.correspondingEnclosingToken!

      // First, let's try to add the end token before the splitting token.
      const indexBeforeSplittingToken = index - 1

      if (tokens[indexBeforeSplittingToken] === startToken) {
        tokens.splice(indexBeforeSplittingToken, 1)
        index -= 1
      } else {
        tokens.splice(index, 0, endToken)
        index += 1
      }

      // Next, let's try to add the corresponding start token after the splitting token.
      const indexAfterSplitterToken = index + 1

      if (tokens[indexAfterSplitterToken] === endToken) {
        tokens.splice(indexAfterSplitterToken, 1)
      } else {
        tokens.splice(indexAfterSplitterToken, 0, startToken)
      }
    }
  }
}


function doesTokenStartAnyConvention(token: Token, conventions: RichConvention[]): boolean {
  return conventions.some(convention => token.role === convention.startTokenRole)
}

function doesTokenEndAnyConvention(token: Token, conventions: RichConvention[]): boolean {
  return conventions.some(convention => token.role === convention.endTokenRole)
}
