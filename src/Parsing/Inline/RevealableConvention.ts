import { TokenKind } from './Tokenization/TokenKind'
import { RevealableInlineSyntaxNodeType } from '../../SyntaxNodes/RevealableInlineSyntaxNodeType'
import { RichConventionWithoutExtraFields } from './RichConventionWithoutExtraFields'


export class RevealableConvention implements RichConventionWithoutExtraFields {
  NodeType: RevealableInlineSyntaxNodeType
  startTokenKind: TokenKind
  endTokenKind: TokenKind

  constructor(
    args: {
      NodeType: RevealableInlineSyntaxNodeType
      startTokenKind: TokenKind
      endTokenKind: TokenKind
    }
  ) {
    this.NodeType = args.NodeType
    this.startTokenKind = args.startTokenKind
    this.endTokenKind = args.endTokenKind
  }
}
