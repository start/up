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
  const intentions = getEmptyIntentions(tokens)
  return applyIntentions(intentions, tokens)
}

function getEmptyIntentions(tokens: Token[]): RaisedVoiceTokenIntention[] {
    const intents: RaisedVoiceTokenIntention[] = []
  
  for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
    const token = tokens[tokenIndex]
    const tokenMeaning = tokens[tokenIndex].meaning
    
    if (-1 !== POTENTIAL_RAISED_VOICE_TOKEN_MEANINGS.indexOf(token.meaning)) {
      intents.push(new RaisedVoiceTokenIntention(tokenIndex, token))
    }
  }
  
  return intents
}

function applyIntentions(intentions: RaisedVoiceTokenIntention[], tokens: Token[]): Token[] {
  // We could probably be naughty and modify the `tokens` collection directly.
  const resultTokens = tokens.slice()
  
  for (const intention of intentions.sort(compareIntentionsDecending)) {
    tokens.splice(intention.originalTokenIndex, 1, ...intention.finalTokens())
  }
  
  return resultTokens
}

class RaisedVoiceTokenIntention {
  constructor(public originalTokenIndex: number, private originalToken: Token) { }
  
  finalTokens(): Token[] {
    return [new Token(TokenMeaning.PlainText, this.originalToken.value)]
  }
}

function compareIntentionsDecending(a: RaisedVoiceTokenIntention, b: RaisedVoiceTokenIntention): number {
  return b.originalTokenIndex - a.originalTokenIndex
}