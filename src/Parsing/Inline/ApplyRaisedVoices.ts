import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Convention } from './Convention'
import { Sandwich } from './Sandwich'
import { TextConsumer } from '../TextConsumer'
import { last, lastChar, swap } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'
import { FailureTracker } from './FailureTracker'
import { applyBackslashEscaping } from '../TextHelpers'
import { STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, INLINE_ASIDE } from './Sandwiches'

const POTENTIAL_RAISED_VOICE_TOKEN_MEANINGS = [
    TokenMeaning.PotentialRaisedVoiceStart,
    TokenMeaning.PotentialRaisedVoiceEnd,
    TokenMeaning.PotentialRaisedVoiceStartOrEnd
  ]
  
export function applyRaisedVoices(tokens: Token[]): Token[] {
  const intents =
    tokens
      .filter(token => -1 !== POTENTIAL_RAISED_VOICE_TOKEN_MEANINGS.indexOf(token.meaning))
      .map(token => new RaisedVoiceTokenIntent(token.meaning))
    
  return tokens.map(token =>
    (POTENTIAL_RAISED_VOICE_TOKEN_MEANINGS.indexOf(token.meaning) !== -1)
      ? new Token(TokenMeaning.PlainText, token.value)
      : token
  )
}

class RaisedVoiceTokenIntent {
  constructor(public meaning: TokenMeaning) { }
}