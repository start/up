import { InlineSyntaxNode } from '../../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { Convention } from '../Convention'
import { TextConsumer } from '../../TextConsumer'
import { last, lastChar, swap } from '../../CollectionHelpers'
import { Token, TokenMeaning } from '.././Token'
import { FailureTracker } from '../FailureTracker'
import { applyBackslashEscaping } from '../../TextHelpers'
import { RaisedVoiceMarker } from './RaisedVoiceDelimiter'

export class StartMarker extends RaisedVoiceMarker {
  tokens(): Token[] {
    // Why reverse these tokens?
    //
    // We determine the ends of conventions in proper order, which means we're implicitly determining the
    // beginnings of conventions in reverse order. 
    return (
      this.tokenMeanings
        .map(meaning => new Token(meaning))
        .reverse()
    )
  }
  
  startStressAndEmphasisTogether(countAsterisksEndMarkerHasInCommon: number): void {
    this.payForStressAndEmphasisTogether(countAsterisksEndMarkerHasInCommon)
    this.tokenMeanings.push(TokenMeaning.EmphasisStart)
    this.tokenMeanings.push(TokenMeaning.StressStart)
  }

  startStress(): void {
    this.payForStress()
    this.tokenMeanings.push(TokenMeaning.StressStart)
  }
  
  startEmphasis(): void {
    this.payForEmphasis()
    this.tokenMeanings.push(TokenMeaning.EmphasisStart)
  }
}
