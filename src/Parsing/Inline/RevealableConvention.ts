import { TokenKind } from './Tokenizing/TokenKind'
import { RevealableInlineSyntaxNodeType } from '../../SyntaxNodes/RevealableInlineSyntaxNodeType'
import { RichConventionWithoutExtraFields } from './RichConventionWithoutExtraFields'


export class RevealableConvention implements RichConventionWithoutExtraFields {
  SyntaxNodeType: RevealableInlineSyntaxNodeType
  startTokenKind: TokenKind
  endTokenKind: TokenKind

  constructor(
    args: {
      SyntaxNodeType: RevealableInlineSyntaxNodeType
      startTokenKind: TokenKind
      endTokenKind: TokenKind
    }
  ) {
    this.SyntaxNodeType = args.SyntaxNodeType
    this.startTokenKind = args.startTokenKind
    this.endTokenKind = args.endTokenKind
  }
}
