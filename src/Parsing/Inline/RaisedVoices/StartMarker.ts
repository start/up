import { Token } from '.././Token'
import { TokenKind } from '.././TokenKind'
import { RaisedVoiceMarker } from './RaisedVoiceMarker'

export class StartMarker extends RaisedVoiceMarker {
  tokens(): Token[] {
    // Why reverse these?
    //
    // We determine the ends of conventions in proper order, which means we're implicitly determining the
    // beginnings of conventions in reverse order. 
    return (
      this.tokenKinds
        .map(kind => new Token({ kind }))
        .reverse()
    )
  }
  
  startStressAndEmphasisTogether(countAsterisksInCommonWithEndMarker: number): void {
    this.payForStressAndEmphasisTogether(countAsterisksInCommonWithEndMarker)
    this.tokenKinds.push(TokenKind.EmphasisStart)
    this.tokenKinds.push(TokenKind.StressStart)
  }

  startStress(): void {
    this.payForStress()
    this.tokenKinds.push(TokenKind.StressStart)
  }
  
  startEmphasis(): void {
    this.payForEmphasis()
    this.tokenKinds.push(TokenKind.EmphasisStart)
  }
}
