import { InlineSyntaxNode } from '../../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { Convention } from '../Convention'
import { TextConsumer } from '../../TextConsumer'
import { last, lastChar, swap } from '../../CollectionHelpers'
import { Token, TokenMeaning } from '.././Token'
import { FailureTracker } from '../FailureTracker'
import { applyBackslashEscaping } from '../../TextHelpers'
import { STRESS, EMPHASIS } from '../SandwichConventions'


const STRESS_COST = STRESS.start.length
const EMPHASIS_COST = EMPHASIS.start.length
const STRESS_AND_EMPHASIS_TOGETHER_COST = STRESS_COST + EMPHASIS_COST


export abstract class RaisedVoiceDelimiter {
  protected tokenMeanings: TokenMeaning[] = []
  public countSurplusAsterisks: number
  
  constructor(public originalTokenIndex: number, public originalValue: string) {
    this.countSurplusAsterisks = originalValue.length
  }

  abstract tokens(): Token[] 
  
  providesNoTokens(): boolean {
    return !this.tokens().length
  }
  
  isFullyMatched(): boolean {
    return this.countSurplusAsterisks <= 0
  }

  canIndicateStressAndEmphasisTogether(): boolean {
    return this.canAfford(STRESS_AND_EMPHASIS_TOGETHER_COST)
  }

  canIndicateEmphasis(): boolean {
    return this.canAfford(EMPHASIS_COST)
  }
  
  canIndicateStress(): boolean {
    return this.canAfford(STRESS_COST)
  }
  
  canOnlyIndicateEmphasis(): boolean {
   return this.canIndicateEmphasis && !this.canIndicateStress() 
  }
  
  canIndicateStressButNotBothTogether(): boolean {
   return this.canIndicateStress && !this.canIndicateStressAndEmphasisTogether() 
  }
  
  payForStressAndEmphasisTogether(countAsterisksMatchingDelimiterHasInCommon: number): void {
    if (countAsterisksMatchingDelimiterHasInCommon < STRESS_AND_EMPHASIS_TOGETHER_COST) {
      throw new Error(`Delimiter at index ${this.originalTokenIndex} only spent ${countAsterisksMatchingDelimiterHasInCommon} to open stress and emphasis`)
    }
    
    this.pay(countAsterisksMatchingDelimiterHasInCommon)
  }
  
  payForStress(): void {
    this.pay(STRESS_COST)
  }
  
  payForEmphasis(): void {
    this.pay(EMPHASIS_COST)
  }
  
  pay(cost: number): void {
    this.countSurplusAsterisks -= cost
  }
  
  private canAfford(cost: number): boolean {
    return this.countSurplusAsterisks >= cost
  }
}

export function compareDelimitersDecending(a: RaisedVoiceDelimiter, b: RaisedVoiceDelimiter): number {
  return b.originalTokenIndex - a.originalTokenIndex
}