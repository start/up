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
      let intention = new RaisedVoiceTokenIntention(tokenIndex, token)
      
      if (intention.canEndConventions()) {
        
      }
      
      intentions.push(intention)
    }
  }

  return intentions
}


function applyIntentions(tokens: Token[], intentions: RaisedVoiceTokenIntention[]): Token[] {
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
    this.assertThisIntentionBreaksNoRules()

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

  canStartConventions(): boolean {
    return this.originalToken.meaning != TokenMeaning.PotentialRaisedVoiceEnd
  }

  canEndConventions(): boolean {
    return this.originalToken.meaning != TokenMeaning.PotentialRaisedVoiceStart
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

  private assertThisIntentionBreaksNoRules(): void {
    const hasStartTokens = !!this.startTokenMeanings.length
    const hasEndTokens = !!this.endTokenMeanings.length

    if (hasStartTokens && hasEndTokens) {
      throw new Error(`Delimiter serving multiple roles at index ${this.originalTokenIndex}`)
    }

    if (!this.canStartConventions() && hasStartTokens) {
      throw new Error(`End delimiter starting conventions at ${this.originalTokenIndex}`)
    }

    if (!this.canEndConventions() && hasEndTokens) {
      throw new Error(`Start delimiter ending conventions at ${this.originalTokenIndex}`)
    }
  }
}


function compareIntentionsDecending(a: RaisedVoiceTokenIntention, b: RaisedVoiceTokenIntention): number {
  return b.originalTokenIndex - a.originalTokenIndex
}


function toToken(meaning: TokenMeaning): Token {
  return new Token(meaning)
}