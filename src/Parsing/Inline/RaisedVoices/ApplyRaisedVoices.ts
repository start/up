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
import { RaisedVoiceDelimiterIntention, compareIntentionsDecending } from './RaisedVoiceDelimiterIntention'
import { IntentionToStartConventions } from './IntentionToStartConventions'
import { IntentionToEndConventions } from './IntentionToEndConventions'
import { PlainTextIntention } from './PlainTextIntention'
import { STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, INLINE_ASIDE } from '../Sandwiches'


export function applyRaisedVoices(tokens: Token[]): Token[] {
  return applyIntentions(tokens, getIntentions(tokens))
}


function getIntentions(tokens: Token[]): RaisedVoiceDelimiterIntention[] {
  const intentions: RaisedVoiceDelimiterIntention[] = []

  for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
    const token = tokens[tokenIndex]
    const {meaning, value} = token

    const canStartConvention = (
      meaning === TokenMeaning.PotentialRaisedVoiceStart
      || meaning === TokenMeaning.PotentialRaisedVoiceStartOrEnd
    )

    const canEndConvention = (
      meaning === TokenMeaning.PotentialRaisedVoiceEnd
      || meaning === TokenMeaning.PotentialRaisedVoiceStartOrEnd
    )

    if (canEndConvention) {
      const intention = new IntentionToEndConventions(tokenIndex, value)

      intentions.push(intention)
    }

    if (canStartConvention) {
      intentions.push(new IntentionToStartConventions(tokenIndex, value))
    } else {
      // Well, we could neither start nor end any conventions using this delimiter. We have no other option but to
      // assume it should be plain text.
      intentions.push(new PlainTextIntention(tokenIndex, value))
    }
  }

  // Finally, if any of our intentions failed to pan out, we convert them to plain text
  const withFailedIntentionsTreatedAsPlainText =
    intentions.map(intention =>
      intention.providesNoTokens()
        ? new PlainTextIntention(intention.originalTokenIndex, intention.originalValue)
        : intention
    )

  return withFailedIntentionsTreatedAsPlainText
}


function applyIntentions(tokens: Token[], intentions: RaisedVoiceDelimiterIntention[]): Token[] {
  // We could probably be naughty and modify the `tokens` collection directly without anyone noticing.
  const resultTokens = tokens.slice()

  for (const intention of intentions.sort(compareIntentionsDecending)) {
    tokens.splice(intention.originalTokenIndex, 1, ...intention.tokens())
  }

  return resultTokens
}

