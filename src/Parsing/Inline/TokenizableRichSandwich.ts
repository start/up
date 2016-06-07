import { TokenKind } from './TokenKind'
import { TokenizerGoal } from './TokenizerGoal'
import { RichConvention } from './RichConvention'
import { regexStartingWith } from '../../Patterns'


export class TokenizableRichSandwich {
  goal: TokenizerGoal
  startPattern: RegExp
  endPattern: RegExp
  startTokenKind: TokenKind
  endTokenKind: TokenKind

  constructor(
    args: {
      startPattern: string,
      endPattern: string,
      richConvention: RichConvention
    }
  ) {
    this.goal = args.richConvention.tokenizerGoal
    this.startPattern = regexStartingWith(args.startPattern, 'i')
    this.endPattern = regexStartingWith(args.endPattern)
    this.startTokenKind = args.richConvention.startTokenKind
    this.endTokenKind = args.richConvention.endTokenKind
  }
}