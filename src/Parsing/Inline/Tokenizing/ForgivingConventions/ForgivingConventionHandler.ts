import { StartDelimiter } from './StartDelimiter'
import { EndDelimiter } from './EndDelimiter'
import { escapeForRegex, patternStartingWith, oneOrMore } from '../../../../PatternHelpers'

// TODO: Clean up


// For a given delimiter character (`delimiterChar`), this class matchds end delimiters with start
// delimiters, even if they aren't perfectly balanced.
export class ForgivingConventionHandler {
  constructor(
    // We save `options` as a field to make it easier to clone this object. 
    private options: {
      // One or more of thse characters comprise every delimiter.
      delimiterChar: string
      // TODO: Explain
      whenDelimitersMatch: (startingBackAtTokenIndex: number, unspentLengthInCommon: number) => void
    },

    // The two optional parameters below are for internal use only. Please see the `clone` method.
    //
    // We store start delimiters from most-to-least recent.
    private startDelimiters: StartDelimiter[] = [],
    public delimiterPattern?: RegExp
  ) {
    this.delimiterPattern = this.delimiterPattern ||
      patternStartingWith(
        oneOrMore(escapeForRegex(options.delimiterChar)))
  }

  get unusedStartDelimiters(): StartDelimiter[] {
    return this.startDelimiters.filter(startDelimiter => startDelimiter.isUnused)
  }

  addStartDelimiter(delimiterText: string, tokenIndex: number) {
    this.startDelimiters.unshift(
      new StartDelimiter(tokenIndex, delimiterText))
  }

  tryToCloseAnyOpenStartDelimiters(endDelimiterText: string): boolean {
    if (!this.openStartDelimiters.length) {
      return false
    }

    const { whenDelimitersMatch } = this.options

    const endDelimiter = new EndDelimiter(endDelimiterText)

    // TODO: Explain
    for (const startDelimiter of this.openStartDelimiters) {
      if (endDelimiter.unspentLength === startDelimiter.unspentLength) {
        whenDelimitersMatch(startDelimiter.tokenIndex, startDelimiter.unspentLength)
        startDelimiter.pay(startDelimiter.unspentLength)

        return true
      }
    }

    // From here on out, if this end delimiter can match with a start delimiter, it will. With
    // each start delimiter, it'll "cancel out" as many characters as possible.
    for (const startDelimiter of this.openStartDelimiters) {
      if (endDelimiter.isFullySpent) {
        return true
      }

      const unspentLengthInCommon =
        Math.min(startDelimiter.unspentLength, endDelimiter.unspentLength)

      whenDelimitersMatch(startDelimiter.tokenIndex, unspentLengthInCommon)
      startDelimiter.pay(unspentLengthInCommon)
      endDelimiter.pay(unspentLengthInCommon)
    }

    return true
  }

  registerTokenInsertion(atIndex: number) {
    for (const startDelimiter of this.openStartDelimiters) {
      if (atIndex < startDelimiter.tokenIndex) {
        startDelimiter.tokenIndex += 1
      }
    }
  }

  // Like the `ConventionContext` class, this class needs to be clonable in order to properly
  // handle backtracking.
  clone(): ForgivingConventionHandler {
    return new ForgivingConventionHandler(
      this.options,
      this.startDelimiters.map(delimiter => delimiter.clone()),
      this.delimiterPattern)
  }

  private get openStartDelimiters(): StartDelimiter[] {
    return this.startDelimiters.filter(delimiter => !delimiter.isFullySpent)
  }
}
