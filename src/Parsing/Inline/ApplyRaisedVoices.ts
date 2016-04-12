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
  const intentions = getEmptyIntentions(tokens)
  return applyIntentions(intentions, tokens)
}

const POTENTIAL_RAISED_VOICE_TOKEN_MEANINGS = [
    TokenMeaning.PotentialRaisedVoiceStart,
    TokenMeaning.PotentialRaisedVoiceEnd,
    TokenMeaning.PotentialRaisedVoiceStartOrEnd
  ]

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
  private startTokenMeanings: TokenMeaning[] = []
  private endTokenMeanings: TokenMeaning[] = []
  
  constructor(public originalTokenIndex: number, private originalToken: Token) { }
  
  finalTokens(): Token[] {
    if (this.startTokenMeanings.length && this.endTokenMeanings.length) {
      throw new Error(`Delimiter serving multiple roles at index ${this.originalTokenIndex}`)
    }
    
    if (this.startTokenMeanings.length) {
      // We indicate the intent to end emphasis/stress conventions in order, which means we're implicitly
      // indicating the intent to start emphasis/stress in reverse order 
      return this.startTokenMeanings.reverse().map(toToken)
    }
    
    if (this.endTokenMeanings.length) { 
      return this.endTokenMeanings.map(toToken)
    }
    
    
    return [new Token(TokenMeaning.PlainText, this.originalToken.value)]
  }
  
  endEmphasis(startDelimiterIntention: RaisedVoiceTokenIntention): void {
    this.endTokenMeanings.push(TokenMeaning.EmphasisEnd)
    
    startDelimiterIntention.startEmphasis()
  }
  
  endStress(startDelimiterIntention: RaisedVoiceTokenIntention): void {
    this.endTokenMeanings.push(TokenMeaning.StressEnd)
    
    startDelimiterIntention.startStress()
  }
  
  private startEmphasis(): void {
    this.startTokenMeanings.push(TokenMeaning.EmphasisStart)
  }
  
  private startStress() {
    this.startTokenMeanings.push(TokenMeaning.StressStart)
  }
}


function compareIntentionsDecending(a: RaisedVoiceTokenIntention, b: RaisedVoiceTokenIntention): number {
  return b.originalTokenIndex - a.originalTokenIndex
}


function toToken(meaning: TokenMeaning): Token {
  return new Token(meaning)
}