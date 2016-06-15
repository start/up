import { EMPHASIS_CONVENTION, STRESS_CONVENTION } from './RichConventions'
import { RichConvention } from './RichConvention'
import { TokenizableConvention } from './TokenizableConvention'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { TokenizerContext } from './TokenizerContext'
import { OnConventionEvent } from './OnConventionEvent'
import { RaisedVoiceStartDelimiter } from './RaisedVoiceStartDelimiter'
import { EncloseWithinArgs } from './EncloseWithinArgs'
import { escapeForRegex, regExpStartingWith, atLeast } from '../../PatternHelpers'
import { remove } from '../../CollectionHelpers'


const EMPHASIS_COST = 1
const STRESS_COST = 2
const STRESS_AND_EMPHASIS_TOGETHER_COST = EMPHASIS_COST + STRESS_COST


export class RaisedVoiceHandler {
  delimiterPattern: RegExp

  private startDelimitersFromMostToLeastRecent: RaisedVoiceStartDelimiter[] = []

  // TODO: Improve interfaces
  private encloseWithin: EncloseWithin
  private insertPlainTextToken: InsertPlainTextToken


  constructor(
    args: {
      delimiterChar: string,
      encloseWithin: EncloseWithin
      insertPlainTextTokenAt: InsertPlainTextToken
    }) {
    const {delimiterChar, encloseWithin } = args

    this.delimiterPattern = regExpStartingWith(atLeast(1, escapeForRegex(delimiterChar)))
    this.encloseWithin = args.encloseWithin
    this.insertPlainTextToken = args.insertPlainTextTokenAt
  }

  addStartDelimiter(delimiter: string, snapshot: TokenizerSnapshot) {
    this.startDelimitersFromMostToLeastRecent.unshift(new RaisedVoiceStartDelimiter(delimiter, snapshot))
  }

  registerTokenInsertion(args: { atIndex: number }) {
    for (const startDelimiter of this.startDelimitersFromMostToLeastRecent) {
      startDelimiter.registerTokenInsertion(args.atIndex)
    }
  }

  tryToCloseAnyRaisedVoices(endDelimiter: string): boolean {
    let unspentEndDelimiterLength = endDelimiter.length

    if (unspentEndDelimiterLength === EMPHASIS_COST) {

      // If an end delimiter has only 1 character available to spend, it can only indicate (i.e. afford) emphasis.
      //
      // For these end delimiters, we want to prioritize matching with the nearest start delimiter that either:
      //
      // 1. Can also only indicate emphasis (1 character to spend)
      // 2. Can indicate both emphasis and stress together (3+ characters to spend)
      //
      // If we can't find any start delimiters that satisfy the above criteria, then we'll settle for a start delimiter
      // that has 2 characters to spend. But this fallback happens later.

      for (const startDelimiter of this.startDelimitersFromMostToLeastRecent) {
        if (startDelimiter.canOnlyAfford(EMPHASIS_COST) || startDelimiter.canAfford(STRESS_AND_EMPHASIS_TOGETHER_COST)) {
          this.applyEmphasis(startDelimiter)

          // Considering this delimiter could only afford to indicate emphasis, we have nothing left to do.
          return true
        }
      }
    } else if (unspentEndDelimiterLength === STRESS_COST) {

      // If an end delimiter has only 2 characters to spend, it can indicate stress, but it can't indicate both stress
      // and emphasis at the saem time.
      //
      // For these end delimiters, we want to prioritize matching with the nearest start delimiter that can indicate
      // stress. It's okay if that start delimiter can indicate both stress and emphasis at the same time! As long
      // as it can indicate stress, we're good. 
      //
      // Only if we can't find one, then we'll match with a delimiter that has just 1 character to spend. But this
      // fallback happens later.

      for (const startDelimiter of this.startDelimitersFromMostToLeastRecent) {
        if (startDelimiter.canAfford(STRESS_COST)) {
          this.applyStress(startDelimiter)

          // Considering this delimiter could only afford to indicate stress, we have nothing left to do.
          return true
        }
      }
    }

    // From here on out, if this end delimiter can match with a start delimiter, it will. It'll try to match as
    // many characters at once as it can.

    for (const startDelimiter of this.startDelimitersFromMostToLeastRecent) {
      if (!unspentEndDelimiterLength) {
        // Once this delimiter has matched all of its characters, its work is done. Let's bail.
        return true
      }

      if (
        unspentEndDelimiterLength >= STRESS_AND_EMPHASIS_TOGETHER_COST
        && startDelimiter.canAfford(STRESS_AND_EMPHASIS_TOGETHER_COST)
      ) {
        // When matching delimiters each have 3 or more characters to spend, their contents become stressed and emphasized,
        // and they cancel out as many of each other's delimiter characters as possible.
        //
        // Therefore, surrounding text with 3 delimiter characters has the same effect as surrounding text with 10.
        //
        // To be clear, any unmatched delimiter characters are *not* canceled, and they remain available to be subsequently
        // matched by other delimiters.

        this.encloseWithin({
          richConvention: EMPHASIS_CONVENTION,
          startingBackAt: startDelimiter.tokenIndex
        })

        this.encloseWithin({
          richConvention: STRESS_CONVENTION,
          startingBackAt: startDelimiter.tokenIndex
        })

        const lengthInCommon =
          Math.min(startDelimiter.unspentDelimiterLength, unspentEndDelimiterLength)

        unspentEndDelimiterLength -= lengthInCommon
        this.applyCostThenRemoveFromCollectionIfFullySpent(startDelimiter, lengthInCommon)

        continue
      }

      if (unspentEndDelimiterLength >= STRESS_COST && startDelimiter.canAfford(STRESS_COST)) {
        this.applyStress(startDelimiter)
        unspentEndDelimiterLength -= STRESS_COST

        continue
      }

      if (unspentEndDelimiterLength >= EMPHASIS_COST && startDelimiter.canAfford(EMPHASIS_COST)) {
        this.applyEmphasis(startDelimiter)
        unspentEndDelimiterLength -= EMPHASIS_COST

        continue
      }
    }

    return unspentEndDelimiterLength !== endDelimiter.length
  }

  treatUnusedStartDelimitersAsPlainText(): void {
    for (const startDelimiter of this.startDelimitersFromMostToLeastRecent) {
      if (startDelimiter.isUnused()) {
        this.insertPlainTextToken({
          text: startDelimiter.text,
          atIndex: startDelimiter.tokenIndex
        })
      }
    }
  }

  private applyEmphasis(startDelimiter: RaisedVoiceStartDelimiter): void {
    this.applyConvention(startDelimiter, EMPHASIS_CONVENTION, EMPHASIS_COST)
  }

  private applyStress(startDelimiter: RaisedVoiceStartDelimiter): void {
    this.applyConvention(startDelimiter, STRESS_CONVENTION, STRESS_COST)
  }

  private applyConvention(startDelimiter: RaisedVoiceStartDelimiter, richConvention: RichConvention, cost: number): void {
    this.encloseWithin({
      richConvention,
      startingBackAt: startDelimiter.tokenIndex
    })

    this.applyCostThenRemoveFromCollectionIfFullySpent(startDelimiter, cost)
  }

  private applyCostThenRemoveFromCollectionIfFullySpent(startDelimiter: RaisedVoiceStartDelimiter, cost: number): void {
    startDelimiter.pay(cost)

    if (startDelimiter.isFullySpent()) {
      remove(this.startDelimitersFromMostToLeastRecent, startDelimiter)
    }
  }
}


interface EncloseWithin {
  (args: EncloseWithinArgs): void
}

interface InsertPlainTextToken {
  (args: { text: string, atIndex: number }): void
}