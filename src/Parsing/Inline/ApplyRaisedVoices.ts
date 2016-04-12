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


abstract class RaisedVoiceTokenIntention {
  constructor(public originalTokenIndex: number, protected originalValue: string) { }

  abstract tokens(): Token[]
}


class IntentionToStartConventions extends RaisedVoiceTokenIntention {
  private startTokenMeanings: TokenMeaning[] = []
  
  constructor(originalTokenIndex: number, originalValue: string) {
    super(originalTokenIndex, originalValue)
  }

  tokens(): Token[] {
      // We indicate the intent to end emphasis/stress conventions in order, which means we're implicitly
      // indicating the intent to start emphasis/stress in reverse order 
      return this.startTokenMeanings.reverse().map(toToken)    
  }
  
  startEmphasis(): void {
    this.startTokenMeanings.push(TokenMeaning.EmphasisStart)
  }

  startStress(): void {
    this.startTokenMeanings.push(TokenMeaning.StressStart)
  }
}


class IntentionToEndConventions extends RaisedVoiceTokenIntention {
  private endTokenMeanings: TokenMeaning[] = []
  
  constructor(originalTokenIndex: number, originalValue: string) {
    super(originalTokenIndex, originalValue)
  }

  tokens(): Token[] {
      // We indicate the intent to end emphasis/stress conventions in order, which means we're implicitly
      // indicating the intent to end emphasis/stress in reverse order 
      return this.endTokenMeanings.reverse().map(toToken)    
  }
  
  endEmphasis(startDelimiterIntention: IntentionToStartConventions): void {
    this.endTokenMeanings.push(TokenMeaning.EmphasisEnd)

    startDelimiterIntention.startEmphasis()
  }

  endStress(startDelimiterIntention: IntentionToStartConventions): void {
    this.endTokenMeanings.push(TokenMeaning.StressEnd)

    startDelimiterIntention.startStress()
  }
}


class IntentionForPlainText extends RaisedVoiceTokenIntention {
  tokens(): Token[] {
    return [new Token(TokenMeaning.PlainText, this.originalValue)]
  }
}


function compareIntentionsDecending(a: RaisedVoiceTokenIntention, b: RaisedVoiceTokenIntention): number {
  return b.originalTokenIndex - a.originalTokenIndex
}


function toToken(meaning: TokenMeaning): Token {
  return new Token(meaning)
}