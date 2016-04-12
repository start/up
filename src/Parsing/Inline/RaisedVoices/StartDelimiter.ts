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
import { STRESS_COST, EMPHASIS_COST, STRESS_AND_EMPHASIS_TOGETHER_COST } from './ConventionCosts'

export class StartDelimiter extends RaisedVoiceDelimiter {
  constructor(originalTokenIndex: number, originalValue: string) {
    super(originalTokenIndex, originalValue)
  }

  tokens(): Token[] {
    // Why reverse these tokens?
    //
    // We determine the ends of conventions in proper order, which means we're implicitly determining the
    // beginnings of conventions in reverse order. 
    return (
      this.tokenMeanings
        .map(meaning => new Token(meaning))
        .reverse()
    )
  }
  
  startEmphasis(): void {
    this.tokenMeanings.push(TokenMeaning.EmphasisStart)
  }

  startStress(): void {
    this.tokenMeanings.push(TokenMeaning.StressStart)
  }
}
