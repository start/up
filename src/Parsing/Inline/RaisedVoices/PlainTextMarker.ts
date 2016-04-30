import { InlineSyntaxNode } from '../../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { Convention } from '../Convention'
import { TextConsumer } from '../TextConsumer'
import { last, lastChar, swap } from '../../CollectionHelpers'
import { applyBackslashEscaping } from '../../TextHelpers'
import { Token } from '../Tokens/Token'
import { RaisedVoiceMarker } from './RaisedVoiceMarker'
import { StartMarker } from './StartMarker'
import { PlainTextToken } from '../Tokens/PlainTextToken'

export class PlainTextMarker extends RaisedVoiceMarker {
  tokens(): Token[] {
    return [new PlainTextToken(this.originalAsterisks)]
  }
}
