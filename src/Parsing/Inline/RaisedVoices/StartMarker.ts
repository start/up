import { Token } from '../Tokens/Token'
import { RaisedVoiceMarker } from './RaisedVoiceMarker'
import { EmphasisStartToken } from '../Tokens/EmphasisStartToken'
import { StressStartToken } from '../Tokens/StressStartToken'

export class StartMarker extends RaisedVoiceMarker {
  tokens(): Token[] {
    // Why reverse these tokens?
    //
    // We determine the ends of conventions in proper order, which means we're implicitly determining the
    // beginnings of conventions in reverse order. 
    return (
      this.tokenTypes
        .map(TokenType => new TokenType())
        .reverse()
    )
  }
  
  startStressAndEmphasisTogether(countAsterisksInCommonWithEndMarker: number): void {
    this.payForStressAndEmphasisTogether(countAsterisksInCommonWithEndMarker)
    this.tokenTypes.push(EmphasisStartToken)
    this.tokenTypes.push(StressStartToken)
  }

  startStress(): void {
    this.payForStress()
    this.tokenTypes.push(StressStartToken)
  }
  
  startEmphasis(): void {
    this.payForEmphasis()
    this.tokenTypes.push(EmphasisStartToken)
  }
}
