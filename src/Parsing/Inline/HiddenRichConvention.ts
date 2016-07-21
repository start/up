import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { RichInlineSyntaxNode } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { TokenKind } from './Tokenization/TokenKind'
import { RichConventionWithoutExtraFields, RichSyntaxNodeWithoutExtraFields } from './RichConventionWithoutExtraFields'


export class HiddenRichConvention {
  NodeType: RichSyntaxNodeWithoutExtraFields
  startTokenKind: TokenKind
  endTokenKind: TokenKind

  constructor(args: RichConventionWithoutExtraFields) {
    this.NodeType = args.NodeType
    this.startTokenKind = args.startTokenKind
    this.endTokenKind = args.endTokenKind
  }
}
