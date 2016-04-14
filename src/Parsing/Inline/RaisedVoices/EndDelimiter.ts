import { InlineSyntaxNode } from '../../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { Convention } from '../Convention'
import { TextConsumer } from '../../TextConsumer'
import { last, lastChar, swap } from '../../CollectionHelpers'
import { Token, TokenMeaning } from '.././Token'
import { FailureTracker } from '../FailureTracker'
import { applyBackslashEscaping } from '../../TextHelpers'
import { RaisedVoiceDelimiter } from './RaisedVoiceDelimiter'
import { StartDelimiter } from './StartDelimiter'
import { STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, INLINE_ASIDE } from '../Sandwiches'


export class EndDelimiter extends RaisedVoiceDelimiter {
  tokens(): Token[] {
    return this.tokenMeanings.map(meaning => new Token(meaning))
  }

  matchAnyApplicableStartDelimiters(delimiters: RaisedVoiceDelimiter[]): void {
    const availableStartDelimitersFromMostRecentToLeast = <StartDelimiter[]>(
      delimiters
        .filter(delimiter => (delimiter instanceof StartDelimiter) && !delimiter.isFullyMatched())
        .reverse()
    )
    
    if (this.canOnlyIndicateEmphasis()) {
      
      // If an end delimiter has only 1 asterisk available to spend, it can only indicate (i.e. afford) emphasis.
      //
      // For these end delimiters, we want to prioritize matching with the nearest start delimiter that either:
      //
      // 1. Can also only indicate emphasis (1 asterisk to spend)
      // 2. Can indicate both emphasis and stress together (3+ asterisks to spend)
      //
      // If we can't find any start delimiters that satisfy the above criteria, then we'll settle for a start delimiter
      // that has 2 asterisks to spend. But this fallback happens later.
      
      for (const startDelimiter of availableStartDelimitersFromMostRecentToLeast) {
        if (startDelimiter.canOnlyIndicateEmphasis() || startDelimiter.canIndicateStressAndEmphasisTogether()) {
          this.endEmphasis(startDelimiter)

          // Considering we could only afford to indicate emphasis, we have nothing left to do.
          return
        }
      }
    } else if (this.canIndicateStressButNotBothTogether()) {
      
      // If an end delimiter has only 2 asterisks to spend, it can indicate stress, but it can't indicate both stress
      // and emphasis at the saem time.
      //
      // For these end delimiters, we want to prioritize matching with the nearest start delimiter that can indicate
      // stress. It's okay if that start delimiter can indicate both stress and emphasis at the same time! As long
      // as it can indicate stress, we're good. 
      //
      // Only if we can't find one, then we'll match with a delimiter that has just 1 asterisk to spend. But this
      // fallback happens later.
      
      for (const startDelimiter of availableStartDelimitersFromMostRecentToLeast) {
        if (startDelimiter.canIndicateStress()) {
          this.endStress(startDelimiter)
          
          // Considering we could only afford to indicate stress, we have nothing left to do.
          return
        }
      }
    }
    
    // From here on out, if this end delimiter can match with a start delimiter, it will. It'll try to match as
    // many asterisks at once as it can.
    
    for (const startDelimiter of availableStartDelimitersFromMostRecentToLeast) {
      if (this.isFullyMatched()) {
        // Once this delimiter has matched all of its asterisks, its work is done. Let's bail.
        break
      }

      if (this.canIndicateStressAndEmphasisTogether() && startDelimiter.canIndicateStressAndEmphasisTogether()) {
        this.startStressAndEmphasisTogether(startDelimiter)
        continue
      }

      if (this.canIndicateStress() && startDelimiter.canIndicateStress()) {
        this.endStress(startDelimiter)
        continue
      }

      if (this.canIndicateEmphasis() && startDelimiter.canIndicateEmphasis()) {
        this.endEmphasis(startDelimiter)
        continue
      }
    }
  }

  private startStressAndEmphasisTogether(startDelimiter: StartDelimiter): void {
    // When matching delimiters each have 3 or more asterisks to spend, their contents become stressed and emphasized,
    // and they cancel out as many of each other's asterisks as possible.
    //
    // Therefore, surrounding text with 3 asterisks has the same effect as surrounding text with 10.
    //
    // To be clear, any unmatched asterisks are *not* canceled, and they remain available to be subsequently matched
    // with other delimiters.
    const countAsterisksDelimitersHaveInCommon =
      Math.min(this.countSurplusAsterisks, startDelimiter.countSurplusAsterisks)

    this.payForStressAndEmphasisTogether(countAsterisksDelimitersHaveInCommon)
    this.tokenMeanings.push(TokenMeaning.EmphasisEnd)
    this.tokenMeanings.push(TokenMeaning.StressEnd)

    startDelimiter.startStressAndEmphasisTogether(countAsterisksDelimitersHaveInCommon)
  }

  private endStress(startDeilmeter: StartDelimiter): void {
    this.payForStress()
    this.tokenMeanings.push(TokenMeaning.StressEnd)

    startDeilmeter.startStress()
  }

  private endEmphasis(startDelimiter: StartDelimiter): void {
    this.payForEmphasis()
    this.tokenMeanings.push(TokenMeaning.EmphasisEnd)

    startDelimiter.startEmphasis()
  }
}