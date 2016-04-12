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
import { RaisedVoiceDelimiterIntention } from './RaisedVoiceDelimiterIntention'
import { STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, INLINE_ASIDE } from '../Sandwiches'


export class IntentionToStartConventions extends RaisedVoiceDelimiterIntention {
  private startTokenMeanings: TokenMeaning[] = []
  
  constructor(originalTokenIndex: number, originalValue: string) {
    super(originalTokenIndex, originalValue)
  }

  tokens(): Token[] {
      // We indicate the intent to end emphasis/stress conventions in order, which means we're implicitly
      // indicating the intent to start emphasis/stress in reverse order 
      return this.startTokenMeanings.reverse().map(meaning => new Token(meaning))    
  }
  
  startEmphasis(): void {
    this.startTokenMeanings.push(TokenMeaning.EmphasisStart)
  }

  startStress(): void {
    this.startTokenMeanings.push(TokenMeaning.StressStart)
  }
}
