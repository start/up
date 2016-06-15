import { EMPHASIS_CONVENTION, STRESS_CONVENTION } from './RichConventions'
import { TokenizableConvention } from './TokenizableConvention'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { TokenizerContext } from './TokenizerContext'
import { OnConventionEvent } from './OnConventionEvent'
import { RaisedVoiceStartDelimiter } from './RaisedVoiceStartDelimiter'


const EMPHASIS_COST = 1
const STRESS_COST = 2
const STRESS_AND_EMPHASIS_TOGETHER_COST = EMPHASIS_COST + STRESS_COST


export class RaisedVoiceHandler {
  private startDelimiters: RaisedVoiceStartDelimiter[] = []
  private delimiterChar: string

  constructor(
    args: {
      delimiterChar: string
      closeNakedUrlIfOpen: Action,
      
    }
  ) {

   }


}


interface Action {
  (): void
}