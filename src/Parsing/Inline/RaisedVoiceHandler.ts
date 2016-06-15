import { EMPHASIS_CONVENTION, STRESS_CONVENTION } from './RichConventions'
import { TokenizableConvention } from './TokenizableConvention'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { TokenizerContext } from './TokenizerContext'
import { OnConventionEvent } from './OnConventionEvent'
import { RaisedVoiceStartDelimiter } from './RaisedVoiceStartDelimiter'
import { EncloseWithinArgs } from './EncloseWithinArgs'
import { escapeForRegex, regExpStartingWith, atLeast } from '../../PatternHelpers'



const EMPHASIS_COST = 1
const STRESS_COST = 2
const STRESS_AND_EMPHASIS_TOGETHER_COST = EMPHASIS_COST + STRESS_COST


export class RaisedVoiceHandler {
  delimiterPattern: RegExp

  private startDelimitersFromMostToLeastRecent: RaisedVoiceStartDelimiter[] = []
  private encloseWithin: EncloseWithin

  constructor(args: { delimiterChar: string, encloseWithin: EncloseWithin }) {
    const {delimiterChar, encloseWithin } = args

    this.delimiterPattern = regExpStartingWith(atLeast(1, escapeForRegex(delimiterChar)))
    this.encloseWithin = args.encloseWithin
  }

  addStartDelimiter(delimiter: string, snapshot: TokenizerSnapshot) {
    this.startDelimitersFromMostToLeastRecent.unshift(new RaisedVoiceStartDelimiter(delimiter, snapshot))
  }

  registerTokenInsertion(args: { atIndex: number }) {
    for (const startDelimiter of this.startDelimitersFromMostToLeastRecent) {
      startDelimiter.registerTokenInsertion(args.atIndex)
    }
  }
/*
  tryToCloseAnyRaisedVoices(endDelimiter: string): boolean {
    let unspentEndDelimiterLength = endDelimiter.length


    if (unspentEndDelimiterLength === EMPHASIS_COST) {

      // If an end marker has only 1 asterisk available to spend, it can only indicate (i.e. afford) emphasis.
      //
      // For these end markers, we want to prioritize matching with the nearest start marker that either:
      //
      // 1. Can also only indicate emphasis (1 asterisk to spend)
      // 2. Can indicate both emphasis and stress together (3+ asterisks to spend)
      //
      // If we can't find any start markers that satisfy the above criteria, then we'll settle for a start marker
      // that has 2 asterisks to spend. But this fallback happens later.

      for (const startDelimiter of this.startDelimitersFromMostToLeastRecent) {
        if (startDelimiter.canOnlyAfford(EMPHASIS_COST) || startDelimiter.canAfford(STRESS_AND_EMPHASIS_TOGETHER_COST)) {
          this.encloseWithin({
            richConvention: EMPHASIS_CONVENTION,
            startingBackAt: startDelimiter.initialTokenIndex
          })
          
          startDelimiter.pay(EMPHASIS_COST)

          // Considering this delimiter could only afford to indicate emphasis, we have nothing left to do.
          unspentEndDelimiterLength = 0
          break
        }
      }
    } else if (unspentEndDelimiterLength === STRESS_COST) {

      // If an end marker has only 2 asterisks to spend, it can indicate stress, but it can't indicate both stress
      // and emphasis at the saem time.
      //
      // For these end markers, we want to prioritize matching with the nearest start marker that can indicate
      // stress. It's okay if that start marker can indicate both stress and emphasis at the same time! As long
      // as it can indicate stress, we're good. 
      //
      // Only if we can't find one, then we'll match with a marker that has just 1 asterisk to spend. But this
      // fallback happens later.

      for (const startDelimiter of this.startDelimitersFromMostToLeastRecent) {
        if (startDelimiter.canAfford(STRESS_COST)) {
          this.encloseWithin({
            richConvention: STRESS_CONVENTION,
            startingBackAt: startDelimiter.initialTokenIndex
          })
          
          startDelimiter.pay(STRESS_COST)

          // Considering this delimiter could only afford to indicate stress, we have nothing left to do.
          unspentEndDelimiterLength = 0
          break
        }
      }
    }

    // From here on out, if this end marker can match with a start marker, it will. It'll try to match as
    // many asterisks at once as it can.

    for (const context of startDelimitersFromMostRecentToLeast) {
      if (!unspentEndDelimiterLength) {
        // Once this marker has matched all of its asterisks, its work is done. Let's bail.
        break
      }

      if ((unspentEndDelimiterLength >= STRESS_AND_EMPHASIS_TOGETHER_COST) && context.canAffordBothEmphasisAndStressTogether()) {
        encloseContextWithin(EMPHASIS_CONVENTION, context)
        encloseContextWithin(STRESS_CONVENTION, context)

        unspentEndDelimiterLength -=
          context.payForEmphasisAndStressTogetherAndGetCost(unspentEndDelimiterLength)

        continue
      }

      if (unspentEndDelimiterLength >= STRESS_COST && context.canAffordStress()) {
        encloseContextWithin(STRESS_CONVENTION, context)

        unspentEndDelimiterLength -= STRESS_COST
        context.payForStress()

        continue
      }

      if (unspentEndDelimiterLength >= EMPHASIS_COST && context.canAffordEmphasis()) {
        encloseContextWithin(EMPHASIS_CONVENTION, context)

        unspentEndDelimiterLength -= EMPHASIS_COST
        context.payForEmphasis()

        continue
      }
    }

    return unspentEndDelimiterLength !== endDelimiter.length
  }*/
}


interface EncloseWithin {
  (args: EncloseWithinArgs): void
}
