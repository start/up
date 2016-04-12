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
import { RaisedVoiceDelimiter } from './RaisedVoiceDelimiter'
import { STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, INLINE_ASIDE } from '../Sandwiches'


export class StartDelimiter extends RaisedVoiceDelimiter {
  private startTokenMeanings: TokenMeaning[] = []
  private unsatisfiedAsteriskDebt: number
  
  constructor(originalTokenIndex: number, originalValue: string) {
    super(originalTokenIndex, originalValue)
    this.unsatisfiedAsteriskDebt = originalValue.length
  }

  tokens(): Token[] {
      // We determine the ends emphasis/stress conventions in proper order, which means we're implicitly
      //determining the beginnings of emphasis/stress in reverse order.
      return this.startTokenMeanings.reverse().map(meaning => new Token(meaning))    
  }
  
  startEmphasis(): void {
    this.startTokenMeanings.push(TokenMeaning.EmphasisStart)
  }

  startStress(): void {
    this.startTokenMeanings.push(TokenMeaning.StressStart)
  }
}
