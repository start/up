import { TokenMeaning } from './TokenMeaning'
import { RevealableInlineSyntaxNodeType } from '../../SyntaxNodes/RevealableInlineSyntaxNodeType'
import { RichConventionWithoutExtraFields } from './RichConventionWithoutExtraFields'


export class RevealableConvention implements RichConventionWithoutExtraFields {
  SyntaxNodeType: RevealableInlineSyntaxNodeType
  startTokenMeaning: TokenMeaning
  endTokenMeaning: TokenMeaning

  constructor(
    args: {
      SyntaxNodeType: RevealableInlineSyntaxNodeType
      startTokenMeaning: TokenMeaning
      endTokenMeaning: TokenMeaning
    }
  ) {
    this.SyntaxNodeType = args.SyntaxNodeType
    this.startTokenMeaning = args.startTokenMeaning
    this.endTokenMeaning = args.endTokenMeaning
  }
}
