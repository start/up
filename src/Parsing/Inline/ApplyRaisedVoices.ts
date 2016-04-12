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

export function applyRaisedVoices(tokens: Token[]): Token[] {
  const POTENTIAL_RAISED_VOICE_TOKENS = [
    TokenMeaning.PotentialRaisedVoiceStart,
    TokenMeaning.PotentialRaisedVoiceEnd,
    TokenMeaning.PotentialRaisedVoiceStartOrEnd
  ]

  return tokens.map(token =>
    (POTENTIAL_RAISED_VOICE_TOKENS.indexOf(token.meaning) !== -1)
      ? new Token(TokenMeaning.PlainText, token.value)
      : token
  )
}