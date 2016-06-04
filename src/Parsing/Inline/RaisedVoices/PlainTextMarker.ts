import { Token } from '.././Token'
import { TokenKind } from '.././TokenKind'
import { RaisedVoiceMarker } from './RaisedVoiceMarker'

export class PlainTextMarker extends RaisedVoiceMarker {
  tokens(): Token[] {
    return [
      new Token({ kind: TokenKind.PlainText, value: this.originalAsterisks })
    ]
  }
}
