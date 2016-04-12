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
import { RaisedVoiceTokenIntention, compareIntentionsDecending } from './RaisedVoiceTokenIntention'
import { IntentionToStartConventions } from './IntentionToStartConventions'
import { IntentionToEndConventions } from './IntentionToEndConventions'
import { IntentionForPlainText } from './IntentionForPlainText'
import { STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, INLINE_ASIDE } from '../Sandwiches'


export function applyRaisedVoices(tokens: Token[]): Token[] {
  return applyIntentions(tokens, getIntentions(tokens))
}

const POTENTIAL_RAISED_VOICE_TOKEN_MEANINGS = [
  TokenMeaning.PotentialRaisedVoiceStart,
  TokenMeaning.PotentialRaisedVoiceEnd,
  TokenMeaning.PotentialRaisedVoiceStartOrEnd
]

function getIntentions(tokens: Token[]): RaisedVoiceTokenIntention[] {
  const intentions: RaisedVoiceTokenIntention[] = []

  for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
    const token = tokens[tokenIndex]

    if (-1 !== POTENTIAL_RAISED_VOICE_TOKEN_MEANINGS.indexOf(token.meaning)) {
      let intention = new IntentionForPlainText(tokenIndex, token.value)
      
      intentions.push(intention)
    }
  }

  return intentions
}


function applyIntentions(tokens: Token[], intentions: RaisedVoiceTokenIntention[]): Token[] {
  // We could probably be naughty and modify the `tokens` collection directly.
  const resultTokens = tokens.slice()

  for (const intention of intentions.sort(compareIntentionsDecending)) {
    tokens.splice(intention.originalTokenIndex, 1, ...intention.tokens())
  }

  return resultTokens
}

