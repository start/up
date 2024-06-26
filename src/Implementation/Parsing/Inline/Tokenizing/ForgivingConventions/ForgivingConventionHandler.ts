import { atLeast, escapeForRegex, patternStartingWith } from '../../../../PatternHelpers'
import { ActiveStartDelimiter } from './ActiveStartDelimiter'

// For a given delimiter character (`delimiterChar`), this class matches end delimiters with start
// delimiters, even if they aren't perfectly balanced.
export class ForgivingConventionHandler {
  delimiterPattern: RegExp
  private startDelimiters: ActiveStartDelimiter[] = []

  constructor(
    // We save `options` as a field to make it easier to clone this object.
    private options: {
      delimiterChar: string
      minDelimiterLength?: number

      // The callback to invoke whenever an end delimiter matches with a start delimiter.
      //
      // This can be invoked more than once per end delimiter. For example:
      //
      // I *really **love cereal!***
      //
      // The end delimiter matches with `**` before "love", then again with `*` before "really".
      whenDelimitersEnclose: (startingBackAtTokenIndex: number, lengthInCommon: number) => void

      // Defines a perfect start/end delimiter match. This predicate allows conventions using the
      // same `delimiterChar` to overlap.
      //
      // For example. let's look at overlapping stress and emphasis:
      //
      //   I *love **drinking* whole** milk.
      //
      // Normally, end delimiters will match with the nearest start delimiter, "canceling out"
      // as many characters as possible, then moving on to the next-nearest start delimiter until
      // it runs out of characters. This strategy is incapable of recognizing the overlapping
      // demonstrated above.
      //
      // However, when `isPerfectMatch` is provided, end delimiters will first try to match the
      // nearest start delimiter satisfying `isPerfectMatch`, ignoring any delimiters in between
      // them.  When a perfect matching start delimiter is found, the end delimiter "cancels out"
      // as many of that start delimiter's characters as possible, and then the handler returns.
      isPerfectMatch?: (startDelimiterLength: number, endDelimiterLength: number) => boolean
    }
  ) {
    const delimiterChar = escapeForRegex(options.delimiterChar)
    const minDelimiterLength = options.minDelimiterLength ?? 1

    this.delimiterPattern = patternStartingWith(
      atLeast(minDelimiterLength, delimiterChar))
  }

  unusedStartDelimiters(): ActiveStartDelimiter[] {
    return this.startDelimiters.filter(startDelimiter => startDelimiter.isUnused())
  }

  addStartDelimiter(startDelimiterText: string, tokenIndex: number): void {
    // Start delimiters are stored from most-to-least recent!
    this.startDelimiters.unshift(
      new ActiveStartDelimiter(tokenIndex, startDelimiterText))
  }

  tryToCloseAnyOpenStartDelimiters(endDelimiterLength: number): boolean {
    if (!this.openStartDelimiters().length) {
      return false
    }

    const { isPerfectMatch } = this.options

    if (isPerfectMatch) {
      const isDelimiterPerfectMatch =
        (startDelimiter: ActiveStartDelimiter) =>
          isPerfectMatch(startDelimiter.remainingLength, endDelimiterLength)

      const perfectStartDelimiter =
        this.openStartDelimiters().find(isDelimiterPerfectMatch)

      if (perfectStartDelimiter) {
        const lengthInCommon =
          Math.min(perfectStartDelimiter.remainingLength, endDelimiterLength)

        this.options.whenDelimitersEnclose(perfectStartDelimiter.tokenIndex, lengthInCommon)
        perfectStartDelimiter.shortenBy(lengthInCommon)

        return true
      }
    }

    // From here on out, the end delimiter will "cancel out" as many remaining characters as
    // it can with each start delimiter.
    for (const startDelimiter of this.openStartDelimiters()) {
      if (!endDelimiterLength) {
        return true
      }

      const lengthInCommon =
        Math.min(startDelimiter.remainingLength, endDelimiterLength)

      this.options.whenDelimitersEnclose(startDelimiter.tokenIndex, lengthInCommon)

      startDelimiter.shortenBy(lengthInCommon)
      endDelimiterLength -= lengthInCommon
    }

    return true
  }

  registerTokenInsertion(atIndex: number): void {
    for (const startDelimiter of this.openStartDelimiters()) {
      if (atIndex < startDelimiter.tokenIndex) {
        startDelimiter.tokenIndex += 1
      }
    }
  }

  // Like the `OpenConvention` class, this class needs to be clonable in order to properly
  // handle backtracking.
  clone(): ForgivingConventionHandler {
    const clone = new ForgivingConventionHandler(this.options)
    clone.startDelimiters = this.startDelimiters.map(delimiter => delimiter.clone())

    return clone
  }

  // Returns open start delimiters from most-to-least recent.
  private openStartDelimiters(): ActiveStartDelimiter[] {
    return this.startDelimiters.filter(delimiter => !delimiter.isFullyExhausted())
  }
}
