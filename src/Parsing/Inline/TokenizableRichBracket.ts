import { TokenizerGoal } from './TokenizerGoal'
import { Bracket } from './Bracket'
import { RichConvention } from './RichConvention'
import { getRegExpStartingWith } from '../../Patterns'

export class TokenizableRichBracket {
  convention: RichConvention
  startPattern: RegExp
  endPattern: RegExp
  rawStartBracket: string
  rawEndBracket: string
  
  constructor(args: { convention: RichConvention, bracket: Bracket }) {
    const { convention, bracket } = args
    
    this.convention = convention
    this.startPattern = getRegExpStartingWith(bracket.startPattern)
    this.endPattern = getRegExpStartingWith(bracket.endPattern)
    this.rawStartBracket = bracket.start
    this.rawEndBracket = bracket.end
  }
}