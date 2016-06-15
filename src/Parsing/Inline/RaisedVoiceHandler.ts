import { EMPHASIS_CONVENTION, STRESS_CONVENTION } from './RichConventions'
import { TokenizableConvention } from './TokenizableConvention'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { TokenizerContext } from './TokenizerContext'
import { OnConventionEvent } from './OnConventionEvent'
import { RaisedVoiceStartDelimiter } from './RaisedVoiceStartDelimiter'
import { EncloseWithinArgs } from './EncloseWithinArgs'
import { escapeForRegex, regExpStartingWith, atLeast } from '../../PatternHelpers'



const EMPHASIS_COST = 1
const STRESS_COST = 2
const STRESS_AND_EMPHASIS_TOGETHER_COST = EMPHASIS_COST + STRESS_COST


export class RaisedVoiceHandler {
  delimiterPattern: RegExp

  private startDelimiters: RaisedVoiceStartDelimiter[] = []
  private encloseWithin: EncloseWithin

  constructor(args: { delimiterChar: string, encloseWithin: EncloseWithin }) {
    const {delimiterChar, encloseWithin } = args

    this.delimiterPattern = regExpStartingWith(atLeast(1, escapeForRegex(delimiterChar)))
    this.encloseWithin = args.encloseWithin
  }

  addStartDelimiter(delimiter: string, snapshot: TokenizerSnapshot) {
    this.startDelimiters.push(new RaisedVoiceStartDelimiter(delimiter, snapshot))
  }

  registerTokenInsertion(args: { atIndex: number }) {
    for (const startDelimiter of this.startDelimiters) {
    startDelimiter.registerTokenInsertion( args.atIndex)
    }
  }

  tryToCloseAnyRaisedVoices(): boolean {
    return true
  }
}


interface EncloseWithin {
  (args: EncloseWithinArgs): void
}