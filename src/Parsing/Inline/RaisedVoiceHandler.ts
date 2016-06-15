import { EMPHASIS_CONVENTION, STRESS_CONVENTION } from './RichConventions'
import { RichConvention } from './RichConvention'
import { TokenizableConvention } from './TokenizableConvention'
import { RaisedVoiceStartDelimiter } from './RaisedVoiceStartDelimiter'
import { RaisedVoiceHandlerSnapshot } from './RaisedVoiceHandlerSnapshot'
import { EncloseWithinArgs } from './EncloseWithinArgs'
import { escapeForRegex, regExpStartingWith, atLeast } from '../../PatternHelpers'
import { remove } from '../../CollectionHelpers'


const EMPHASIS_COST = 1
const STRESS_COST = 2
const STRESS_AND_EMPHASIS_TOGETHER_COST = EMPHASIS_COST + STRESS_COST


export class RaisedVoiceHandler {
  delimiterPattern: RegExp

  private startDelimiters: RaisedVoiceStartDelimiter[] = []
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

  addStartDelimiter(delimiter: string, tokenIndex: number) {
    this.startDelimiters.push(
      new RaisedVoiceStartDelimiter(delimiter, tokenIndex))
  }

  registerTokenInsertion(args: { atIndex: number }) {
    for (const startDelimiter of this.startDelimiters) {
      startDelimiter.registerTokenInsertion(args.atIndex)
    }
  }

  tryToCloseAnyRaisedVoices(endDelimiter: string): boolean {
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

      for (let i = this.startDelimiters.length - 1; i >= 0; i--) {
        const startDelimiter = this.startDelimiters[i]

        if (startDelimiter.canOnlyAfford(EMPHASIS_COST) || startDelimiter.canAfford(STRESS_AND_EMPHASIS_TOGETHER_COST)) {
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

      for (let i = this.startDelimiters.length - 1; i >= 0; i--) {
        const startDelimiter = this.startDelimiters[i]

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

    // Once this delimiter has matched all of its characters, its work is done, so we terminate the loop.
    for (let i = this.startDelimiters.length - 1; unspentEndDelimiterLength && i >= 0; i--) {
      const startDelimiter = this.startDelimiters[i]

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

  treatUnusedStartDelimitersAsPlainText(): void {
    for (const startDelimiter of this.startDelimiters) {
      if (startDelimiter.isUnused()) {
        this.insertPlainTextToken({
          text: startDelimiter.text,
          atIndex: startDelimiter.tokenIndex
        })
      }
    }
  }

  getCurrentSnapshot(): RaisedVoiceHandlerSnapshot {
    return new RaisedVoiceHandlerSnapshot(this.startDelimiters)
  }

  reset(snapshot: RaisedVoiceHandlerSnapshot): void {
    this.startDelimiters =
      snapshot.startDelimitersFromMostToLeastRecent
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
      remove(this.startDelimiters, startDelimiter)
    }
  }
}


interface EncloseWithin {
  (args: EncloseWithinArgs): void
}

interface InsertPlainTextToken {
  (args: { text: string, atIndex: number }): void
}