import { StartDelimiter } from './StartDelimiter'
import { EndDelimiter } from './EndDelimiter'
import { escapeForRegex, patternStartingWith, oneOrMore } from '../../../../PatternHelpers'


// For a given delimiter character (`delimiterChar`), this class matchds end delimiters with start
// delimiters, even if they aren't perfectly balanced.
export class ForgivingConventionHandler {
  constructor(
    // We save `options` as a field to make it easier to clone this object. 
    private options: {
      // One or more of thse characters comprise every delimiter.
      delimiterChar: string
      // TODO: Explain
      whenDelimitersEnclose: (startingBackAtTokenIndex: number, lengthInCommon: number) => void
      shouldSkipEverythingElseIf?: (startDelimiterLength: number, endDelimiterLength: number) => boolean
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

    const { whenDelimitersEnclose, shouldSkipEverythingElseIf } = this.options

    if (shouldSkipEverythingElseIf) {
      const endDelimiterLength = endDelimiterText.length

      const shouldMatchThenSkipEverythingElse =
        (startDelimiter: StartDelimiter) =>
          shouldSkipEverythingElseIf(startDelimiter.remainingLength, endDelimiterLength)

      const perfectStartDelimiter =
        first(this.openStartDelimiters, shouldMatchThenSkipEverythingElse)

      if (perfectStartDelimiter) {
        const lengthInCommon =
          Math.min(perfectStartDelimiter.remainingLength, endDelimiterLength)

        whenDelimitersEnclose(perfectStartDelimiter.tokenIndex, lengthInCommon)
        perfectStartDelimiter.pay(lengthInCommon)

        return true
      }
    }

    const endDelimiter = new EndDelimiter(endDelimiterText)

    // From here on out, the end delimiter will "cancel out" as many unspent characters as
    // possible with each start delimiter.
    for (const startDelimiter of this.openStartDelimiters) {
      if (endDelimiter.isFullySpent) {
        return true
      }

      const commonUnspentLength =
        Math.min(startDelimiter.remainingLength, endDelimiter.remainingLength)

      whenDelimitersEnclose(startDelimiter.tokenIndex, commonUnspentLength)
      startDelimiter.pay(commonUnspentLength)
      endDelimiter.pay(commonUnspentLength)
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


function first<T>(items: T[], predicate: (item: T) => boolean): T {
  for (const item of items) {
    if (predicate(item)) {
      return item
    }
  }

  return null
}