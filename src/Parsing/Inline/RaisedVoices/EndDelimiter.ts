import { InlineSyntaxNode } from '../../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { Convention } from '../Convention'
import { Sandwich } from '../Sandwich'
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
    const startDelimitersFromMostToLeastRecent = <StartDelimiter[]>(
      delimiters
        .filter(delimiter => delimiter instanceof StartDelimiter)
        .reverse()
    )
    

    for (const startDelimiter of startDelimitersFromMostToLeastRecent) {
      // We keep looping until we're out of start delimiters or out of asterisks to spend
      if (this.countSurplusAsterisks <= 0) {
        break
      }
      
      if (this.canAffordStressAndEmphasisTogether() && startDelimiter.canAffordStressAndEmphasisTogether()) {
        // When matching delimiters each have 3 or more asterisks to spend, their contents become stressed and emphasized,
        // and they cancel out as many of each other's asterisks as possible.
        //
        // Therefore, surrounding text with 3 asterisks has the same effect as surrounding text with 10.
        //
        // To be clear, any unmatched asterisks are *not* canceled, and they remain available to be subsequently matched
        // with other delimiters.
        const cost = Math.min(this.countSurplusAsterisks, startDelimiter.countSurplusAsterisks)
        
        continue
      }
      
      if (this.canAffordStress() && startDelimiter.canAffordStress()) {
        continue
      }
      
      if (this.canAffordEmphasis() && startDelimiter.canAffordEmphasis()) {
        continue
      }
    }
  }

  private endEmphasis(startDelimiter: StartDelimiter): void {
    this.tokenMeanings.push(TokenMeaning.EmphasisEnd)

    startDelimiter.startEmphasis()
  }

  private endStress(startDeilmeter: StartDelimiter): void {
    this.tokenMeanings.push(TokenMeaning.StressEnd)

    startDeilmeter.startStress()
  }
}