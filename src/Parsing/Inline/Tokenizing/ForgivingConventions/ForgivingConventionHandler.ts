import { StartDelimiter } from './StartDelimiter'
import { EndDelimiter } from './EndDelimiter'
import { Delimiter } from './Delimiter'
import { RichConvention } from '../RichConvention'
import { EncloseWithinConventionArgs } from '../EncloseWithinConventionArgs'
import { escapeForRegex, patternStartingWith, oneOrMore } from '../../../../PatternHelpers'
import { remove } from '../../../../CollectionHelpers'


// For a given delimiter character (`delimiterChar`), this class matchds end delimiters with start
// delimiters, even if they aren't perfectly balanced.
export class ForgivingConventionHandler {
  constructor(
    // We save `options` as a field to make it easier to clone this object. 
    private options: {
      // One or more of thse characters comprise every delimiter.
      delimiterChar: string
      // The convention (if any) indicated by enclosing text within single delimiter characters.
      minorConvention?: RichConvention
      // The convention (if any) indicated by enclosing text within double delimiter characters.
      majorConvention?: RichConvention
      // A callback to invoke whenever it comes time to wrap content in one of the aforementioned conventions.
      encloseWithinConvention: (args: EncloseWithinConventionArgs) => void
      // A callback to invoke whenever it comes time to treat a dangling start delimiter as plain text. 
      insertTextToken: (text: string, atIndex: number) => void
    },
    // The two optional parameters below are for internal use only. Please see the `clone` method.
    private openStartDelimiters: StartDelimiter[] = [],
    public delimiterPattern?: RegExp
  ) {
    if (!options.minorConvention && !options.majorConvention) {
      throw new Error('No supported writing conventions')
    }

    this.delimiterPattern = this.delimiterPattern ||
      patternStartingWith(
        oneOrMore(escapeForRegex(options.delimiterChar)))
  }

  addStartDelimiter(delimiterText: string, tokenIndex: number) {
    this.openStartDelimiters.push(
      new StartDelimiter(tokenIndex, delimiterText))
  }

  registerTokenInsertion(args: { atIndex: number }) {
    for (const startDelimiter of this.openStartDelimiters) {
      startDelimiter.registerTokenInsertion(args.atIndex)
    }
  }

  tryToCloseAnyOpenStartDelimiters(endDelimiterText: string): boolean {
    if (!this.openStartDelimiters.length) {
      return false
    }

    const endDelimiter = new EndDelimiter(endDelimiterText)

    const supportsMinorConvention = (this.options.minorConvention != null)
    const supportsMajorConvention = (this.options.majorConvention != null)
    const supportsBothMinorAndMajorConventions =
      supportsMinorConvention && supportsMajorConvention

    if (supportsBothMinorAndMajorConventions) {
      if (canOnlyAffordMinorConvention(endDelimiter)) {
        // If an end delimiter is just 1 character long, it can only indicate (i.e. afford) the minor convention.
        //
        // However, we don't blindly match with the closest start delimiter. If possible, we'd like to avoid matching
        // with a start delimiter that has exactly 2 unspent characters, because the author of the markup probably
        // intended that start delimiter to be matched with an end delimiter that *also* has 2 characters to spend.
        //
        // For example:
        //
        //   I *love **drinking* whole** milk.
        //
        // The `*` end delimiter after "drinking" should be matched with the `*` start delimiter before "love".
        // The nearest start delimiter---the `**` before "drinking"---should instead be matched with the `**`
        // end delimiter with 2 asterisks that follows.
        //
        // To be clear, we're perfectly happy to match with the nearest start delimiter that has *more* than 2
        // unspent delimiter characters! We'd simply like to avoid matching with start delimiters with exactly
        // 2 characters.
        //
        // That being said, if every open start delimiter has exactly 2 characters to spend, we'll settle for the
        // nearest one. But this fallback happens later.

        for (let i = this.openStartDelimiters.length - 1; i >= 0; i--) {
          const startDelimiter = this.openStartDelimiters[i]

          if (canOnlyAffordMinorConvention(startDelimiter) ||  canAffordMinorAndMajorConventionTogether(startDelimiter)) {
            this.applyMinorConvention(startDelimiter)

            // Considering the end delimiter was only a single character, we have nothing left to do.
            return true
          }
        }
      } else if (canOnlyAffordMajorConvention(endDelimiter)) {
        // If an end delimiter is just 2 characters long, it can ebd an instance of the major convention, but it can't
        // end both the major and minor conventions at the same time.
        //
        // For these end delimiters, we want to prioritize matching with the nearest start delimiter that can start the
        // major convention (i.e. has two or more unspent characters). It's okay if that start delimiter can start both
        // the major and minor conventions at the same time (i.e. has 3 or more unspent characters)! As long as it can
        // start the major convention, we're good. 
        //
        // If we can't find a start delimiter that can start the major convention, then we'll match with a start delimiter
        // that has just 1 character to spend. But this fallback happens later (and when it does, it only represents the
        // minor convention).

        for (let i = this.openStartDelimiters.length - 1; i >= 0; i--) {
          const startDelimiter = this.openStartDelimiters[i]

          if (canAffordMajorConvention(startDelimiter)) {
            this.applyMajorConvention(startDelimiter)

            // Considering the end delimiter was exactly two characters long, we have nothing left to do.
            return true
          }
        }
      }
    }

    // From here on out, if this end delimiter can match with a start delimiter, it will. It'll try to match as
    // many characters at once as it can.
    //
    // Once again, we'll check start delimiters from most to least recent.

    // Once this delimiter has spent all of its characters, it has nothing left to do, so we terminate the loop.
    for (let i = this.openStartDelimiters.length - 1; (i >= 0) && !endDelimiter.isTotallySpent; i--) {
      const startDelimiter = this.openStartDelimiters[i]

      if (supportsBothMinorAndMajorConventions) {
        // When matching delimiters each have 3 or more characters to spend:
        //
        // 1. The text they enclose becomes nested within both minor and major conventions.
        // 2. These delimiters cancel out as many of each other's characters as possible.
        //
        // Therefore, surrounding text with 3 delimiter characters has the same effect as surrounding text with 10:
        //
        // 1. This is ***emphasized and stressed***.
        // 2. This is also **********emphasized and stressed**********.
        //
        // To be clear, any unmatched delimiter characters are *not* canceled, and they remain available to be
        // subsequently matched by other delimiters.

        const unspentLengthInCommon = startDelimiter.commonUnspentLength(endDelimiter)

        if (unspentLengthInCommon >= MIN_COST_FOR_MINOR_AND_MAJOR_CONVENTIONS_TOGETHER) {
          this.encloseWithin({
            richConvention: this.options.minorConvention,
            startingBackAtTokenIndex: startDelimiter.tokenIndex
          })

          this.encloseWithin({
            richConvention: this.options.majorConvention,
            startingBackAtTokenIndex: startDelimiter.tokenIndex
          })

          this.spendCostThenRemoveFromCollectionIfFullySpent(startDelimiter, unspentLengthInCommon)
          endDelimiter.pay(unspentLengthInCommon)

          continue
        }
      }

      // Assuming we support the major convention, can we afford it?
      if (supportsMajorConvention && canAffordMajorConvention(endDelimiter) && canAffordMajorConvention(startDelimiter)) {
        this.applyMajorConvention(startDelimiter)
        payForMajorConvention(endDelimiter)

        continue
      }

      if (supportsMinorConvention) {
        // We know we have at least 1 end delimiter character to spend; otherwise, we would have terminated the
        // loop. And we know that every start delimiter in our collection has at least 1 character to spend;
        // otherwise, the start delimiter would have been removed from `openStartDelimiters`.
        this.applyMinorConvention(startDelimiter)
        payForMinorConvention(endDelimiter)

        continue
      }

      throw new Error('No supported writing conventions')
    }

    // If our potential end delimiter matched any start delimiters, its duty is served. Even if it still has some
    // unspent characters, that's okay! Forgiving delimiters don't have to be perfectly balanced.
    //
    // However, if our potential end delimiter didn't match with any start delimiters, then we can't exactly call
    // it an end delimiter.
    //
    // Initially, we suspected this delimiter was an end delimiter because it's touching the end of some content.
    // If it's also touching the beginning of some content (e.g. it's in the middle of a word), then the tokenizer
    // will subequently treat it as a potential start delimiter. Otherwise, the tokenizer will subquently treat it
    // as plain text.
    return true
  }

  treatDanglingStartDelimitersAsText(): void {
    for (const startDelimiter of this.openStartDelimiters) {
      if (startDelimiter.isTotallyUnspent) {
        this.options.insertTextToken(startDelimiter.delimiterText, startDelimiter.tokenIndex)
      }
    }
  }

  // Like the `ConventionContext` class, this class needs to be clonable in order to properly handle backtracking.
  clone(): ForgivingConventionHandler {
    return new ForgivingConventionHandler(
      this.options,
      this.openStartDelimiters.map(delimiter => delimiter.clone()),
      this.delimiterPattern)
  }

  private applyMinorConvention(startDelimiter: StartDelimiter): void {
    this.applyConvention(startDelimiter, this.options.minorConvention, MINOR_CONVENTION_COST)
  }

  private applyMajorConvention(startDelimiter: StartDelimiter): void {
    this.applyConvention(startDelimiter, this.options.majorConvention, MAJOR_CONVENTION_COST)
  }

  private applyConvention(startDelimiter: StartDelimiter, richConvention: RichConvention, cost: number): void {
    this.encloseWithin({
      richConvention,
      startingBackAtTokenIndex: startDelimiter.tokenIndex
    })

    this.spendCostThenRemoveFromCollectionIfFullySpent(startDelimiter, cost)
  }

  private encloseWithin(args: EncloseWithinConventionArgs) {
    this.options.encloseWithinConvention(args)
  }

  private spendCostThenRemoveFromCollectionIfFullySpent(startDelimiter: StartDelimiter, cost: number): void {
    startDelimiter.pay(cost)

    if (startDelimiter.isTotallySpent) {
      remove(this.openStartDelimiters, startDelimiter)
    }
  }
}


const MINOR_CONVENTION_COST = 1
const MAJOR_CONVENTION_COST = 2
const MIN_COST_FOR_MINOR_AND_MAJOR_CONVENTIONS_TOGETHER =
  MINOR_CONVENTION_COST + MAJOR_CONVENTION_COST

function canAffordMajorConvention(delimiter: Delimiter): boolean {
  return delimiter.canAfford(MAJOR_CONVENTION_COST)
}

function canAffordMinorAndMajorConventionTogether(delimiter: Delimiter): boolean {
  return delimiter.canAfford(MIN_COST_FOR_MINOR_AND_MAJOR_CONVENTIONS_TOGETHER)
}

function canOnlyAffordMinorConvention(delimiter: Delimiter): boolean {
  return delimiter.canOnlyAfford(MINOR_CONVENTION_COST)
}

function canOnlyAffordMajorConvention(delimiter: Delimiter): boolean {
  return delimiter.canOnlyAfford(MAJOR_CONVENTION_COST)
}

function payForMinorConvention(delimiter: Delimiter): void {
  delimiter.pay(MINOR_CONVENTION_COST)
}

function payForMajorConvention(delimiter: Delimiter): void {
  delimiter.pay(MAJOR_CONVENTION_COST)
}
