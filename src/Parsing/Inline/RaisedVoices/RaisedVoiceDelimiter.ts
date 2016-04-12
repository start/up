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
import { STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, INLINE_ASIDE } from '../Sandwiches'
import { STRESS_COST, EMPHASIS_COST, STRESS_AND_EMPHASIS_TOGETHER_COST } from './ConventionCosts'

export abstract class RaisedVoiceDelimiter {
  protected tokenMeanings: TokenMeaning[] = []
  protected countSurplusAsterisks: number
  
  constructor(public originalTokenIndex: number, public originalValue: string) {
    this.countSurplusAsterisks = originalValue.length
  }

  abstract tokens(): Token[] 
  
  providesNoTokens(): boolean {
    return !this.tokens().length
  }

  canAffordtEmphasisAndStressTogether(): boolean {
    return this.countSurplusAsterisks >= STRESS_AND_EMPHASIS_TOGETHER_COST
  }

  canAffordEmphasis(): boolean {
    return this.countSurplusAsterisks >= EMPHASIS_COST
  }
  
  canAffordStress(): boolean {
    return this.countSurplusAsterisks >= STRESS_COST
  }
}

export function compareDelimitersDecending(a: RaisedVoiceDelimiter, b: RaisedVoiceDelimiter): number {
  return b.originalTokenIndex - a.originalTokenIndex
}