import { StartDelimiter } from './StartDelimiter'
import { RichConvention } from '../RichConvention'
import { EncloseWithinConventionArgs } from '../EncloseWithinConventionArgs'
import { escapeForRegex, patternStartingWith, oneOrMore } from '../../../../PatternHelpers'
import { remove } from '../../../../CollectionHelpers'


// For a given delimiter character (`delimiterChar`), instances of this class match end delimiters with start
// delimiters. 
export class ForgivingConventionHandler {
  constructor(
    // We save `args` as a field to make it easier to clone this object. 
    private args: {
      // One or more of thse characters comprise every delimiter.
      delimiterChar: string
      // The convention (if any) indicated by surrounding text with a single delimiter character on either side.
      minorConvention?: RichConvention
      // The convention (if any) indicated by surrounding text with double delimiter characters on either side.
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
    if (!args.minorConvention && !args.majorConvention) {
      throw new Error('No supported writing conventions')
    }

    this.delimiterPattern = this.delimiterPattern ||
      patternStartingWith(
        oneOrMore(escapeForRegex(args.delimiterChar)))
  }

  addStartDelimiter(delimiter: string, tokenIndex: number) {
    this.openStartDelimiters.push(
      new StartDelimiter(delimiter, tokenIndex))
  }

  registerTokenInsertion(args: { atIndex: number }) {
    for (const startDelimiter of this.openStartDelimiters) {
      startDelimiter.registerTokenInsertion(args.atIndex)
    }
  }

  tryToCloseAnyOpenDelimiters(endDelimiter: string): boolean {
    const { supportsMinorConvention, supportsMajorConvention, combinedInflectionMinCost } = this

    if (supportsMinorConvention && (endDelimiter.length === MINOR_CONVENTION_COST)) {
      // If an end delimiter is just 1 character long, it can only indicate (i.e. afford) the minor convention,
      // assuming the minor convention is supported.
      //
      // If major inflection is not supported (i.e. for quotes), then we simply match with the nearest open
      // start delimiter. If that start delimiter has just 1 character to "spend", we subsequently mark that
      // start delimiter as closed (by removing it from `openStartDelimiters`).  On the other hand, if that
      // start delimiter has 2 or more characters to spend, then we merely "spend" 1 of them. The start
      // delimiter is still considered open, albeit with 1 fewer characters to spend.
      //
      // If major inflection is supported (i.e. for asterisks and underscores), we don't blindly match with
      // the closest start delimiter. If possible, we'd rather avoid matching with a start delimiter that has
      // exactly 2 characters to spend, because the author of the text probably intended that start delimiter
      // to be matched with an end delimiter that *also* has 2 characters to spend.
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
      // delimiter characters to spend! We'd simply like to avoid matching with start delimiters with exactly
      // 2.
      // That being said, if there aren't any start delimiters ' then we'll
      // settle for a start delimiter that has 2 characters to spend. But this fallback happens later.

      for (let i = this.openStartDelimiters.length - 1; i >= 0; i--) {
        const startDelimiter = this.openStartDelimiters[i]

        if (startDelimiter.canOnlyAfford(MINOR_CONVENTION_COST) || startDelimiter.canAfford(combinedInflectionMinCost)) {
          this.applyMinorInflection(startDelimiter)

          // Considering this end delimiter could only afford to indicate minor inflection, we have nothing left to do.
          return true
        }
      }
    } else if (supportsMajorConvention && (endDelimiter.length === MAJOR_CONVENTION_COST)) {
      // If major inflection is supported, and if an end delimiter is just 2 characters long, it can indicate major
      // inflection, but it can't indicate both major and minor inflection at the same time.
      //
      // For these end delimiters, we want to prioritize matching with the nearest start delimiter that can indicate
      // major inflection. It's okay if that start delimiter can indicate both major and minor inflection at the same
      // time! As long as it can indicate major inflection, we're good. 
      //
      // If we can't find a start delimiter that can indicate major inflection, then we'll match with a start delimiter
      // that has just 1 character to spend. But this fallback happens later (and when it does, it only indicates minor
      // inflection).

      for (let i = this.openStartDelimiters.length - 1; i >= 0; i--) {
        const startDelimiter = this.openStartDelimiters[i]

        if (startDelimiter.canAfford(MAJOR_CONVENTION_COST)) {
          this.applyMajorInflection(startDelimiter)

          // Considering this end delimiter could only afford to indicate major inflection, we have nothing left to
          // do.
          return true
        }
      }
    }

    // From here on out, if this end delimiter can match with a start delimiter, it will. It'll try to match as
    // many characters at once as it can.
    //
    // We'll start by checking 

    let unspentEndDelimiterLength = endDelimiter.length

    // Once this delimiter has spent all of its characters, it has nothing left to do, so we terminate the loop.
    for (let i = this.openStartDelimiters.length - 1; (i >= 0) && unspentEndDelimiterLength; i--) {
      const startDelimiter = this.openStartDelimiters[i]

      // Can we afford combined inflection?
      if ((unspentEndDelimiterLength >= this.combinedInflectionMinCost) && startDelimiter.canAfford(combinedInflectionMinCost)) {
        this.encloseWithin({
          richConvention: this.args.minorConvention,
          startingBackAtTokenIndex: startDelimiter.tokenIndex
        })

        if (supportsMajorConvention) {
          this.encloseWithin({
            richConvention: this.args.majorConvention,
            startingBackAtTokenIndex: startDelimiter.tokenIndex
          })
        }

        const lengthInCommon =
          Math.min(startDelimiter.unspentLength, unspentEndDelimiterLength)

        this.applyCostThenRemoveFromCollectionIfFullySpent(startDelimiter, lengthInCommon)
        unspentEndDelimiterLength -= lengthInCommon

        continue
      }

      // Assuming we support major inflection, can we afford it?
      if (
        supportsMajorConvention
        && unspentEndDelimiterLength >= MAJOR_CONVENTION_COST
        && startDelimiter.canAfford(MAJOR_CONVENTION_COST)
      ) {
        this.applyMajorInflection(startDelimiter)
        unspentEndDelimiterLength -= MAJOR_CONVENTION_COST

        continue
      }

      // We know we have at least 1 end delimiter character to spend; otherwise, we would have terminated the loop. And we
      // know that every start delimiter in our collection has at least 1 character to spend; otherwise, the start delimiter
      // would have been removed from `startDelimitersFromMostToLeastRecent`.
      this.applyMinorInflection(startDelimiter)
      unspentEndDelimiterLength -= MINOR_CONVENTION_COST
    }

    return unspentEndDelimiterLength < endDelimiter.length
  }

  treatDanglingStartDelimitersAsText(): void {
    for (const startDelimiter of this.openStartDelimiters) {
      if (startDelimiter.isDangling()) {
        this.args.insertTextToken(startDelimiter.delimiterText, startDelimiter.tokenIndex)
      }
    }
  }

  // Like the `ConventionContext` class, this class needs to be clonable in order to properly handle backtracking.
  clone(): ForgivingConventionHandler {
    return new ForgivingConventionHandler(
      this.args,
      this.openStartDelimiters.map(delimiter => delimiter.clone()),
      this.delimiterPattern)
  }

  private get supportsMinorConvention(): boolean {
    return (this.args.minorConvention != null)
  }

  private get supportsMajorConvention(): boolean {
    return (this.args.majorConvention != null)
  }

  // When major inflection is supported (i.e. asterisks and underscores)
  // ===================================================================
  //
  // When matching delimiters each have 3 or more characters to spend, the text they surround becomes both
  // major and minor inflected. These delimiters cancel out as many of each other's characters as possible.
  //
  // Therefore, surrounding text with 3 delimiter characters has the same effect as surrounding text with 10:
  //
  // 1. This is ***emphasized and stressed***.
  // 2. This is also **********emphasized and stressed**********.
  //
  // To be clear, any unmatched delimiter characters are *not* canceled, and they remain available to be
  // subsequently matched by other delimiters.
  //
  // When major inflection is not supported (i.e. quotes)
  // ====================================================
  //
  // Delimiters will always cancel out as many of each other's characters as possible. 
  private get combinedInflectionMinCost(): number {
    return (
      this.supportsMajorConvention
        ? MINOR_CONVENTION_COST + MAJOR_CONVENTION_COST
        : MINOR_CONVENTION_COST * 2)
  }

  private encloseWithin(args: EncloseWithinConventionArgs) {
    this.args.encloseWithinConvention(args)
  }

  private applyMinorInflection(startDelimiter: StartDelimiter): void {
    this.applyConvention(startDelimiter, this.args.minorConvention, MINOR_CONVENTION_COST)
  }

  private applyMajorInflection(startDelimiter: StartDelimiter): void {
    this.applyConvention(startDelimiter, this.args.majorConvention, MAJOR_CONVENTION_COST)
  }

  private applyConvention(startDelimiter: StartDelimiter, richConvention: RichConvention, cost: number): void {
    this.encloseWithin({
      richConvention,
      startingBackAtTokenIndex: startDelimiter.tokenIndex
    })

    this.applyCostThenRemoveFromCollectionIfFullySpent(startDelimiter, cost)
  }

  private applyCostThenRemoveFromCollectionIfFullySpent(startDelimiter: StartDelimiter, cost: number): void {
    startDelimiter.pay(cost)

    if (startDelimiter.isFullySpent()) {
      remove(this.openStartDelimiters, startDelimiter)
    }
  }
}


const MINOR_CONVENTION_COST = 1
const MAJOR_CONVENTION_COST = 2
