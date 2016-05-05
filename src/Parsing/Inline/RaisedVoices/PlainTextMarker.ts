import { Token } from '../Tokens/Token'
import { RaisedVoiceMarker } from './RaisedVoiceMarker'
import { PlainTextToken } from '../Tokens/PlainTextToken'

export class PlainTextMarker extends RaisedVoiceMarker {
  tokens(): Token[] {
    return [new PlainTextToken(this.originalAsterisks)]
  }
}
