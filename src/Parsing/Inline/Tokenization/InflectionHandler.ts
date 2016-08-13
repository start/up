import { EMPHASIS_CONVENTION, STRESS_CONVENTION } from '../RichConventions'
import { RichConvention } from './RichConvention'
import { InflectionStartDelimiter } from './InflectionStartDelimiter'
import { EncloseWithinRichConventionArgs } from './EncloseWithinRichConventionArgs'
import { escapeForRegex, patternStartingWith, atLeastOne } from '../../PatternHelpers'
import { remove } from '../../../CollectionHelpers'


// Applies the (forgiving) rules for inflection conventions, pairing end delimiters with open start delimiters.   
export class InflectionHandler {
  constructor(
    // We save `args` as a field to make it easier to clone this object. 
    private args: {
      delimiterChar: string
      encloseWithinRichConvention: (args: EncloseWithinRichConventionArgs) => void
      insertPlainTextToken: (text: string, atIndex: number) => void
    },
    // The two optional parameters below are for private use. Please see the `clone` method.
    private openStartDelimiters: InflectionStartDelimiter[] = [],
    public delimiterPattern?: RegExp
  ) {
    this.delimiterPattern = this.delimiterPattern ||
      patternStartingWith(
        atLeastOne(escapeForRegex(args.delimiterChar)))
  }

  addOpenStartDelimiter(delimiter: string, tokenIndex: number) {
    this.openStartDelimiters.push(
      new InflectionStartDelimiter(delimiter, tokenIndex))
  }

  registerTokenInsertion(args: { atIndex: number }) {
    for (const startDelimiter of this.openStartDelimiters) {
      startDelimiter.registerTokenInsertion(args.atIndex)
    }
  }

  tryToCloseAnyOpenDelimiters(endDelimiter: string): boolean {
    if (endDelimiter.length === EMPHASIS_COST) {

      // If an end delimiter is just 1 character long, it can only indicate (i.e. afford) emphasis.
      //
      // For these end delimiters, we want to prioritize matching with the nearest start delimiter that either:
      //
      // 1. Can also only indicate emphasis (1 character to spend)
      // 2. Can indicate both emphasis and stress together (3+ characters to spend)
      //
      // If we can't find any start delimiters that satisfy the above criteria, then we'll settle for a start delimiter
      // that has 2 characters to spend. But this fallback happens later.

      for (let i = this.openStartDelimiters.length - 1; i >= 0; i--) {
        const startDelimiter = this.openStartDelimiters[i]

        if (startDelimiter.canOnlyAfford(EMPHASIS_COST) || startDelimiter.canAfford(MIN_SHOUTING_COST)) {
          this.applyEmphasis(startDelimiter)

          // Considering this end delimiter could only afford to indicate emphasis, we have nothing left to do.
          return true
        }
      }
    } else if (endDelimiter.length === STRESS_COST) {

      // If an end delimiter is just 2 characters long, it can indicate stress, but it can't indicate both stress
      // and emphasis at the same time.
      //
      // For these end delimiters, we want to prioritize matching with the nearest start delimiter that can indicate
      // stress. It's okay if that start delimiter can indicate both stress and emphasis at the same time! As long
      // as it can indicate stress, we're good. 
      //
      // Only if we can't find one, then we'll match with a delimiter that has just 1 character to spend. But this
      // fallback happens later.

      for (let i = this.openStartDelimiters.length - 1; i >= 0; i--) {
        const startDelimiter = this.openStartDelimiters[i]

        if (startDelimiter.canAfford(STRESS_COST)) {
          this.applyStress(startDelimiter)

          // Considering this end delimiter could only afford to indicate stress, we have nothing left to do.
          return true
        }
      }
    }

    // From here on out, if this end delimiter can match with a start delimiter, it will. It'll try to match as
    // many characters at once as it can.

    let unspentEndDelimiterLength = endDelimiter.length

    // Once this delimiter has spent all of its characters, it has nothing left to do, so we terminate the loop.
    for (let i = this.openStartDelimiters.length - 1; unspentEndDelimiterLength && i >= 0; i--) {
      const startDelimiter = this.openStartDelimiters[i]

      if (unspentEndDelimiterLength >= MIN_SHOUTING_COST && startDelimiter.canAfford(MIN_SHOUTING_COST)) {
        // When matching delimiters each have 3 or more characters to spend, the text they surround become "shouted"
        // (stressed and emphasized). Shouting delimiters cancel out as many of each other's characters as possible.
        //
        // Therefore, surrounding text with 3 delimiter characters has the same effect as surrounding text with 10:
        //
        // 1. This is ***emphasized and stressed***.
        // 2. This is also **********emphasized and stressed**********.
        //
        // To be clear, any unmatched delimiter characters are *not* canceled, and they remain available to be
        // subsequently matched by other delimiters.

        this.encloseWithin({
          richConvention: EMPHASIS_CONVENTION,
          startingBackAtTokenIndex: startDelimiter.tokenIndex
        })

        this.encloseWithin({
          richConvention: STRESS_CONVENTION,
          startingBackAtTokenIndex: startDelimiter.tokenIndex
        })

        const lengthInCommon =
          Math.min(startDelimiter.unspentLength, unspentEndDelimiterLength)

        this.applyCostThenRemoveFromCollectionIfFullySpent(startDelimiter, lengthInCommon)
        unspentEndDelimiterLength -= lengthInCommon

        continue
      }

      if (unspentEndDelimiterLength >= STRESS_COST && startDelimiter.canAfford(STRESS_COST)) {
        this.applyStress(startDelimiter)
        unspentEndDelimiterLength -= STRESS_COST

        continue
      }

      // We know we have at least 1 end delimiter character to spend; otherwise, we would have terminated the loop. And we
      // know that every start delimiter in our collection has at least 1 character to spend; otherwise, the start delimiter
      // would have been removed from `startDelimitersFromMostToLeastRecent`.
      this.applyEmphasis(startDelimiter)
      unspentEndDelimiterLength -= EMPHASIS_COST
    }

    return unspentEndDelimiterLength < endDelimiter.length
  }

  treatDanglingStartDelimitersAsPlainText(): void {
    for (const startDelimiter of this.openStartDelimiters) {
      if (startDelimiter.isUnused()) {
        this.args.insertPlainTextToken(startDelimiter.delimiterText, startDelimiter.tokenIndex)
      }
    }
  }

  // Like the `ConventionContext` class, this class needs to be clonable in order to properly handle backtracking.
  clone(): InflectionHandler {
    return new InflectionHandler(
      this.args,
      this.openStartDelimiters.map(delimiter => delimiter.clone()),
      this.delimiterPattern)
  }

  private encloseWithin(args: EncloseWithinRichConventionArgs) {
    this.args.encloseWithinRichConvention(args)
  }

  private applyEmphasis(startDelimiter: InflectionStartDelimiter): void {
    this.applyConvention(startDelimiter, EMPHASIS_CONVENTION, EMPHASIS_COST)
  }

  private applyStress(startDelimiter: InflectionStartDelimiter): void {
    this.applyConvention(startDelimiter, STRESS_CONVENTION, STRESS_COST)
  }

  private applyConvention(startDelimiter: InflectionStartDelimiter, richConvention: RichConvention, cost: number): void {
    this.encloseWithin({
      richConvention,
      startingBackAtTokenIndex: startDelimiter.tokenIndex
    })

    this.applyCostThenRemoveFromCollectionIfFullySpent(startDelimiter, cost)
  }

  private applyCostThenRemoveFromCollectionIfFullySpent(startDelimiter: InflectionStartDelimiter, cost: number): void {
    startDelimiter.pay(cost)

    if (startDelimiter.isFullySpent()) {
      remove(this.openStartDelimiters, startDelimiter)
    }
  }
}


const EMPHASIS_COST = 1
const STRESS_COST = 2
const MIN_SHOUTING_COST = EMPHASIS_COST + STRESS_COST
