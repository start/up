import { TokenKind } from './Tokenization/TokenKind'
import { RichConventionWithoutExtraFields, RichSyntaxNodeWithoutExtraFields } from './RichConventionWithoutExtraFields'


// A "revealable" inline convention is one that requires deliberate action from the reader to reveal.
//
// Spoilers are an example.
export class RevealableConvention {
  NodeType: RichSyntaxNodeWithoutExtraFields
  startTokenKind: TokenKind
  endTokenKind: TokenKind

  constructor(args: RichConventionWithoutExtraFields) {
    this.NodeType = args.NodeType
    this.startTokenKind = args.startTokenKind
    this.endTokenKind = args.endTokenKind
  }
}
