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
import { StartMarker } from './StartDelimiter'

export class PlainTextMarker extends RaisedVoiceMarker {
  tokens(): Token[] {
    return [new Token(TokenMeaning.PlainText, this.originalValue)]
  }
}
