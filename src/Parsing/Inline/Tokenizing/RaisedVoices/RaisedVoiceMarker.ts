import { Token} from '../Tokens/Token'
import { TokenType } from '../Tokens/TokenType'


const EMPHASIS_COST = 1
const STRESS_COST = 2
const STRESS_AND_EMPHASIS_TOGETHER_COST = STRESS_COST + EMPHASIS_COST


export abstract class RaisedVoiceMarker {
  countSurplusAsterisks: number
  protected tokenTypes: TokenType[] = []
  
  constructor(public originalTokenIndex: number, public originalAsterisks: string) {
    this.countSurplusAsterisks = originalAsterisks.length
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
  
  payForStressAndEmphasisTogether(countAsterisksInCommonWithMatchingDelimiter: number): void {
    if (countAsterisksInCommonWithMatchingDelimiter < STRESS_AND_EMPHASIS_TOGETHER_COST) {
      throw new Error(`Marker at index ${this.originalTokenIndex} only spent ${countAsterisksInCommonWithMatchingDelimiter} to open stress and emphasis`)
    }
    
    this.pay(countAsterisksInCommonWithMatchingDelimiter)
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