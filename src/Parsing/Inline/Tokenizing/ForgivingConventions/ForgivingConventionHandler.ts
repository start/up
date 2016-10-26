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
    private openStartDelimiters: StartDelimiter[] = [],
    public delimiterPattern?: RegExp
  ) {
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
      // If there *are* any open start delimiters, our potential end delimiter will match at least
      // one of them.
      //
      // The matching delimiters don't have to be the same length! Forgiving convention delimiters
      // don't have to be perfectly balanced.
      //
      // However, if there aren't any open start delimiters, then we can't exactly call this
      // delimiter an "end delimiter". Initially, we suspected it was an end delimiter because it's
      // touching the end of some content. If it's *also* touching the beginning of some content
      // (e.g. it's in the middle of a word), then the tokenizer will subequently treat it as a
      // potential start delimiter. Otherwise, the tokenizer will subquently treat it as plain text.
      return false
    }

    const endDelimiter = new EndDelimiter(endDelimiterText)

    // TODO: Explain
    for (let i = this.openStartDelimiters.length - 1; i >= 0; i--) {
      const startDelimiter = this.openStartDelimiters[i]

      if (endDelimiter.unspentLength === startDelimiter.unspentLength) {
        this.options.whenDelimitersMatch(startDelimiter.tokenIndex, startDelimiter.unspentLength)
        this.openStartDelimiters.splice(i, 1)

        return true
      }
    }

    // From here on out, if this end delimiter can match with a start delimiter, it will. It'll
    // try to match as many characters at once as it can.
    //
    // Once again, we'll check start delimiters from most to least recent.
    //
    // Take notice of the condition for this loop! Once the end delimiter has spent all of its
    // characters, we have nothing else to do.
    for (let i = this.openStartDelimiters.length - 1; (i >= 0) && !endDelimiter.isTotallySpent; i--) {
      const startDelimiter = this.openStartDelimiters[i]

      const unspentLengthInCommon = startDelimiter.commonUnspentLength(endDelimiter)

      this.options.whenDelimitersMatch(startDelimiter.tokenIndex, unspentLengthInCommon)

      endDelimiter.pay(unspentLengthInCommon)
      startDelimiter.pay(unspentLengthInCommon)

      if (startDelimiter.isTotallySpent) {
        this.openStartDelimiters.splice(i, 1)
      }
    }

    return true
  }

  unusedStartDelimiters(): StartDelimiter[] {
    return this.openStartDelimiters
      .filter(startDelimiter => startDelimiter.isUnused)
  }

  // Like the `ConventionContext` class, this class needs to be clonable in order to properly
  // handle backtracking.
  clone(): ForgivingConventionHandler {
    return new ForgivingConventionHandler(
      this.options,
      this.openStartDelimiters.map(delimiter => delimiter.clone()),
      this.delimiterPattern)
  }
}

